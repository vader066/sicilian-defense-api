import { Request, Response } from "express";
import { PlayerService } from "./player-service";
import { BaseHandler } from "@/shared/handler";
import { PLAYER } from "@/types/database/models";
import { PlayerReq, PlayerReqSchema } from "@/types/player";
import { randomUUID } from "node:crypto";
import z from "zod";
import { AdminManagementService } from "../admin-management-service/service";
import { parse } from "csv-parse/sync";
import { validateCsv } from "./csv-validator";

// Use arrow functions for the methods to automatically bind this

export class PlayerServiceHandler extends BaseHandler {
	private playerService = new PlayerService();
	private adminClient = new AdminManagementService();

	// const body = this.validate<CREATEACCOUNTREQ>(req, Crthis.playerService.eateAccountReqSchema);
	getClubPlayersHandler = async (req: Request, res: Response) => {
		try {
			const userId = this.authenticate(req);
			const clubId = req.params.clubId;

			// check if player is club admin
			const admin = await this.adminClient.getAdminByID(userId);
			if (admin.club_id != clubId) {
				res.status(403).json({
					message: `This user is not an admin for club or club does not exist`,
					data: null,
					status: 403,
				});
			}

			// make db call for players
			const result = await this.playerService.GetClubPlayers(clubId);
			res.status(200).json({ message: "success", data: result, status: 200 });
		} catch (error: any) {
			const status = this.errorStatus(error);
			res
				.status(status)
				.json({ message: error.message, data: null, status: status });
		}
	};

	getPlayerHandler = async (req: Request, res: Response) => {
		try {
			const userId = this.authenticate(req);
			const admin = await this.adminClient.getAdminByID(userId);
			const result = await this.playerService.GetPlayerByID(
				req.params.playerId,
			);
			if (admin.club_id != result.club_id) {
				res.status(403).json({
					message: `This user and player do not belong to the same club`,
					data: null,
					status: 403,
				});
			}
			res.status(200).json({ message: "success", data: result, status: 200 });
		} catch (error: any) {
			const status = this.errorStatus(error);
			res
				.status(status)
				.json({ message: error.message, data: null, status: status });
		}
	};

	updatePlayerHandler = async (req: Request, res: Response) => {
		try {
			// authenticate admin user
			const userId = this.authenticate(req);

			// validate request body
			const body = this.validate<PlayerReq>(req, PlayerReqSchema);

			// Admin authorization - verify player and admin belong to the same club
			const admin = await this.adminClient.getAdminByID(userId);
			const player = await this.playerService.GetPlayerByID(
				req.params.playerId,
			);
			if (admin.club_id != player.club_id) {
				res.status(403).json({
					message: `This admin user and player do not belong to the same club`,
					data: null,
					status: 403,
				});
			}

			const updatedFields: PLAYER = {
				...body,
				id: player.id,
				club_id: admin.club_id,
			};
			const updatedPlayer =
				await this.playerService.UpdatePlayer(updatedFields);
			res
				.status(200)
				.json({ message: "success", data: updatedPlayer, status: 200 });
		} catch (error: any) {
			const status = this.errorStatus(error);
			res
				.status(status)
				.json({ message: error.message, data: null, status: status });
		}
	};

	createPlayerHandler = async (req: Request, res: Response) => {
		try {
			// authenticate user
			const userId = this.authenticate(req);

			// validate request body
			const body = this.validate<PlayerReq>(req, PlayerReqSchema);

			// get admin to obtain club id
			const admin = await this.adminClient.getAdminByID(userId);
			const playerID = randomUUID();

			// create player
			const player: PLAYER = { ...body, club_id: admin.club_id, id: playerID };
			const result = await this.playerService.CreatePlayer(player);
			res.status(200).json({ message: "success", data: result, status: 200 });
		} catch (error: any) {
			const status = this.errorStatus(error);
			res
				.status(status)
				.json({ message: error.message, data: null, status: status });
		}
	};

	createPlayersHandler = async (req: Request, res: Response) => {
		try {
			// authenticate user
			const userId = this.authenticate(req);

			// validate request body
			const schemaArray = z.array(PlayerReqSchema);
			const body = this.validate<PlayerReq[]>(req, schemaArray);

			// get admin to obtain club id
			const admin = await this.adminClient.getAdminByID(userId);
			const clubId = admin.club_id;

			// create player for admins club
			// deliberately using empty strings for id as final query will generate ids
			const players: PLAYER[] = body.map((player) => {
				return { ...player, club_id: clubId, id: "" };
			});

			const result = await this.playerService.createPlayerList(players);
			res.status(200).json({
				message: "success",
				data: { players_added: result, players_requested: body.length },
				status: 200,
			});
		} catch (error: any) {
			const status = this.errorStatus(error);
			res
				.status(status)
				.json({ message: error.message, data: null, status: status });
		}
	};

	uploadPlayersHandler = async (req: Request, res: Response) => {
		try {
			// authenticate user
			const userId = this.authenticate(req);

			// ensure a file was uploaded
			if (!req.file) {
				res
					.status(400)
					.json({ message: "No CSV file provided", data: null, status: 400 });
				return;
			}

			// parse CSV into raw rows (arrays), first row is headers
			const csvContent = req.file.buffer.toString("utf-8");
			const rawRows: string[][] = parse(csvContent, {
				skip_empty_lines: true,
				trim: true,
			});

			if (rawRows.length === 0) {
				res
					.status(400)
					.json({ message: "CSV file is empty", data: null, status: 400 });
				return;
			}

			const headers = rawRows[0];
			const dataRows: Record<string, string>[] = rawRows.slice(1).map((row) => {
				const record: Record<string, string> = {};
				headers.forEach((header, i) => {
					record[header] = row[i] ?? "";
				});
				return record;
			});

			// validate headers then rows
			const validation = validateCsv(headers, dataRows);
			if (!validation.valid) {
				res.status(400).json({
					message: "CSV validation failed",
					data: { errors: validation.errors },
					status: 400,
				});
				return;
			}

			// assign club_id from authenticated admin; id is left empty because
			// the repository generates it via gen_random_uuid() in the query.
			const admin = await this.adminClient.getAdminByID(userId);
			const players: PLAYER[] = validation.players.map((p) => ({
				...p,
				id: "",
				club_id: admin.club_id,
			}));

			const result = await this.playerService.uploadPlayers(players);
			res.status(200).json({
				message: "success",
				data: {
					players_added: result,
					players_requested: dataRows.length,
				},
				status: 200,
			});
		} catch (error: any) {
			const status = this.errorStatus(error);
			res
				.status(status)
				.json({ message: error.message, data: null, status: status });
		}
	};
}
