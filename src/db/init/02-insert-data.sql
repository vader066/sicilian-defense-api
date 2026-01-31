-- Insert club
INSERT INTO clubs (id, club_name, number_of_players, created_at, updated_at)
VALUES (
  'e7b8f7c4-3b21-4c9e-a8f4-1d2f6a5f9b0a',
  'KNUST CHESS CLUB',
  36,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Insert players
INSERT INTO players
(id, first_name, last_name, sex, date_of_birth, programme, username, created_at, updated_at, club_id)
VALUES
(gen_random_uuid(), 'Alexis', 'Baffour Owusu Annor', 'MALE', '2003-11-05', 'Pharmacy', 'sixelA23', NOW(), NOW(), 'e7b8f7c4-3b21-4c9e-a8f4-1d2f6a5f9b0a'),
(gen_random_uuid(), 'Emmanuel', 'Yeboah', 'MALE', '2005-07-20', 'Computer Science', 'sisco_fy', NOW(), NOW(), 'e7b8f7c4-3b21-4c9e-a8f4-1d2f6a5f9b0a'),
(gen_random_uuid(), 'Paapa', 'Fahodzi', 'MALE', '2002-10-03', 'Medicine', 'PaapaFahodzi', NOW(), NOW(), 'e7b8f7c4-3b21-4c9e-a8f4-1d2f6a5f9b0a'),
(gen_random_uuid(), 'Francis', 'Marfo', 'MALE', '2003-03-06', 'Bsc Business Administration Accounting', 'Marfo1', NOW(), NOW(), 'e7b8f7c4-3b21-4c9e-a8f4-1d2f6a5f9b0a'),
(gen_random_uuid(), 'Kofi Amoh', 'Barimah', 'MALE', '2005-04-01', 'BSc. Marine Engineering', 'Kabywabtoms', NOW(), NOW(), 'e7b8f7c4-3b21-4c9e-a8f4-1d2f6a5f9b0a'),
(gen_random_uuid(), 'Michael', 'Anim Danso', 'MALE', '2002-09-21', 'None', 'macLean51', NOW(), NOW(), 'e7b8f7c4-3b21-4c9e-a8f4-1d2f6a5f9b0a'),
(gen_random_uuid(), 'Johnny Edem', 'Agboado', 'MALE', '1999-08-24', 'None', 'j3akoblaechess', NOW(), NOW(), 'e7b8f7c4-3b21-4c9e-a8f4-1d2f6a5f9b0a'),
(gen_random_uuid(), 'Joshua', 'Kumordzie Gbegah', 'MALE', '2006-01-15', 'BSc Chemical Engineering', 'Survivor_15', NOW(), NOW(), 'e7b8f7c4-3b21-4c9e-a8f4-1d2f6a5f9b0a'),
(gen_random_uuid(), 'Akwasi', 'Yeboah', 'MALE', '2000-02-13', 'MPhil Soil & Water Engineering', 'AY112', NOW(), NOW(), 'e7b8f7c4-3b21-4c9e-a8f4-1d2f6a5f9b0a'),
(gen_random_uuid(), 'Raphael', 'Appiah', 'MALE', '2003-05-26', 'Bsc. Biological sciences', 'Raph_k', NOW(), NOW(), 'e7b8f7c4-3b21-4c9e-a8f4-1d2f6a5f9b0a'),
(gen_random_uuid(), 'Nana Kwame', 'Opoku', 'MALE', '2005-09-17', 'Chemical engineering', 'teslamate', NOW(), NOW(), 'e7b8f7c4-3b21-4c9e-a8f4-1d2f6a5f9b0a'),
(gen_random_uuid(), 'Solomon', 'Asemsuro', 'MALE', '2004-05-10', 'Bsc. Business Administration( Marketing and International Business )', 'asemsuros', NOW(), NOW(), 'e7b8f7c4-3b21-4c9e-a8f4-1d2f6a5f9b0a'),
(gen_random_uuid(), 'Ernest', 'Adokwei Tetteh', 'MALE', '2000-06-22', 'Molecular Medicine', 'Mr-Hydrogen', NOW(), NOW(), 'e7b8f7c4-3b21-4c9e-a8f4-1d2f6a5f9b0a'),
(gen_random_uuid(), 'Enam', 'Tsike-Sossah', 'MALE', '2005-09-08', 'Aerospace Engineering', 'Sossah', NOW(), NOW(), 'e7b8f7c4-3b21-4c9e-a8f4-1d2f6a5f9b0a'),
(gen_random_uuid(), 'Job', 'Adjei Nkrumah', 'MALE', '1992-06-24', 'None', 'Anane_Carter', NOW(), NOW(), 'e7b8f7c4-3b21-4c9e-a8f4-1d2f6a5f9b0a'),
(gen_random_uuid(), 'Akwasi', 'Agyei', 'MALE', '2005-03-20', 'Computer Science', 'ii_apoa', NOW(), NOW(), 'e7b8f7c4-3b21-4c9e-a8f4-1d2f6a5f9b0a'),
(gen_random_uuid(), 'Jubilee', 'Bleboo', 'FEMALE', '2005-10-19', 'Medicine', 'qroxie', NOW(), NOW(), 'e7b8f7c4-3b21-4c9e-a8f4-1d2f6a5f9b0a'),
(gen_random_uuid(), 'Stan', 'Badu', 'MALE', '2006-09-17', 'Computer Science', 'Yuritarded1234', NOW(), NOW(), 'e7b8f7c4-3b21-4c9e-a8f4-1d2f6a5f9b0a'),
(gen_random_uuid(), 'Regis', 'Lamboni', 'MALE', '2004-06-16', 'Medical imaging', 'Reg_is', NOW(), NOW(), 'e7b8f7c4-3b21-4c9e-a8f4-1d2f6a5f9b0a'),
(gen_random_uuid(), 'Charles', 'Amoani', 'MALE', '2005-11-11', 'Computer Engineering', 'charlesa11', NOW(), NOW(), 'e7b8f7c4-3b21-4c9e-a8f4-1d2f6a5f9b0a'),
(gen_random_uuid(), 'Kwadwo', 'Acheampong', 'MALE', '2003-12-01', 'Accounting', 'Jjk2233', NOW(), NOW(), 'e7b8f7c4-3b21-4c9e-a8f4-1d2f6a5f9b0a'),
(gen_random_uuid(), 'Isaac', 'Koomson', 'MALE', '2003-03-25', 'Electrical engineering', 'ikoomsonn', NOW(), NOW(), 'e7b8f7c4-3b21-4c9e-a8f4-1d2f6a5f9b0a'),
(gen_random_uuid(), 'Enoch', 'Nenyo', 'MALE', '2007-11-27', 'Telecom Engineering', 'Nenyo', NOW(), NOW(), 'e7b8f7c4-3b21-4c9e-a8f4-1d2f6a5f9b0a'),
(gen_random_uuid(), 'Eleazar', 'Adams', 'MALE', '2005-02-12', 'Mathematics', 'Kealfx', NOW(), NOW(), 'e7b8f7c4-3b21-4c9e-a8f4-1d2f6a5f9b0a'),
(gen_random_uuid(), 'Lawrence', 'Obeng', 'MALE', '2006-12-19', 'Civil Engineering', 'Lobeng', NOW(), NOW(), 'e7b8f7c4-3b21-4c9e-a8f4-1d2f6a5f9b0a'),
(gen_random_uuid(), 'Johnny Edem', 'Agboado', 'MALE', '1999-08-24', 'None', 'EdemEthics', NOW(), NOW(), 'e7b8f7c4-3b21-4c9e-a8f4-1d2f6a5f9b0a'),
(gen_random_uuid(), 'David', 'Broni', 'MALE', '2005-11-19', 'Computer engineering', 'Bossgrass', NOW(), NOW(), 'e7b8f7c4-3b21-4c9e-a8f4-1d2f6a5f9b0a'),
(gen_random_uuid(), 'Fredrick', 'Opoku', 'MALE', '2005-07-07', 'Mechanical Engineering', 'frick_0', NOW(), NOW(), 'e7b8f7c4-3b21-4c9e-a8f4-1d2f6a5f9b0a')
ON CONFLICT DO NOTHING;
