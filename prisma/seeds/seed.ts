import { faker } from '@faker-js/faker';
import { PrismaPg } from '@prisma/adapter-pg';
import argon2 from 'argon2';
import dotenv from 'dotenv';
import { uuidv7 } from 'uuidv7';

import { PrismaClient, Role } from '../generated/client';

dotenv.config({ path: '.env.development.local' });

const adapter = new PrismaPg({
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	host: process.env.DATABASE_HOST,
	port: process.env.DATABASE_PORT,
	database: process.env.DATABASE_NAME
});
const prisma = new PrismaClient({ adapter });

function generateUsername(): string {
	const adjectives = [
		'Cool',
		'Fast',
		'Dark',
		'Bold',
		'Wild',
		'Sharp',
		'Bright',
		'Fierce'
	];
	const nouns = [
		'Wolf',
		'Eagle',
		'Tiger',
		'Dragon',
		'Hawk',
		'Lion',
		'Bear',
		'Fox'
	];
	const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
	const noun = nouns[Math.floor(Math.random() * nouns.length)];
	const num = Math.floor(Math.random() * 900) + 100;
	const special = '!@#$%^&*'[Math.floor(Math.random() * 8)];
	return `${adj}${noun}${num}${special}`;
}

function generatePassword(): string {
	const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const lower = 'abcdefghijklmnopqrstuvwxyz';
	const digits = '0123456789';
	const special = '!@#$%^&*';

	const required =
		upper[Math.floor(Math.random() * upper.length)] +
		digits[Math.floor(Math.random() * digits.length)] +
		special[Math.floor(Math.random() * special.length)];

	const all = upper + lower + digits + special;
	const rest = Array.from(
		{ length: 8 },
		() => all[Math.floor(Math.random() * all.length)]
	).join('');

	return (required + rest)
		.split('')
		.sort(() => Math.random() - 0.5)
		.join('');
}

async function main() {
	console.log('Seeding database...');

	await prisma.profile.deleteMany();
	await prisma.account.deleteMany();

	// --- ADMIN ---
	const adminId = uuidv7();
	await prisma.account.create({
		data: {
			id: adminId,
			username: 'Admin12',
			email: 'admin@example.com',
			password:
				'$argon2id$v=19$m=65536,t=3,p=4$hutRFdmdvLT02gteeFUmFw$9pAlnaZgHpTOiQBUA70Ifzby52hRTo/UM42lKEUVZzw', // ADMIN12#
			isVerified: true,
			role: Role.ADMIN
		}
	});
	console.log('Admin created');

	// --- 200 пользователей ---
	const TOTAL = 200;
	const WITH_PROFILE = 100;

	const usedUsernames = new Set<string>();
	const usedEmails = new Set<string>();

	for (let i = 0; i < TOTAL; i++) {
		let username: string;
		do {
			username = generateUsername();
		} while (usedUsernames.has(username));
		usedUsernames.add(username);

		let email: string;
		do {
			email = faker.internet.email().toLowerCase();
		} while (usedEmails.has(email));
		usedEmails.add(email);

		const password = generatePassword();
		const hashedPassword = await argon2.hash(
			password + process.env.HASH_PEPPER,
			{
				type: argon2.argon2id,
				memoryCost: Number(process.env.MEMORY_COST),
				timeCost: Number(process.env.TIME_COST),
				parallelism: Number(process.env.PARALLELISM)
			}
		);

		const accountId = uuidv7();

		await prisma.account.create({
			data: {
				id: accountId,
				username,
				email,
				password: hashedPassword,
				isVerified: true,
				role: Role.USER,
				balance: {
					create: {
						id: uuidv7(),
						amount: 0n
					}
				},
				...(i < WITH_PROFILE
					? {
							profile: {
								create: {
									id: uuidv7(),
									firstName: faker.person.firstName(),
									lastName: faker.person.lastName(),
									age: faker.number.int({ min: 18, max: 80 }),
									description: faker.datatype.boolean()
										? faker.lorem.sentence()
										: null,
									avatars: {
										createMany: {
											data: [
												{
													id: uuidv7(),
													name: uuidv7() + '.jpeg'
												},
												{
													id: uuidv7(),
													name: uuidv7() + '.jpeg'
												},
												{
													id: uuidv7(),
													name: uuidv7() + '.jpeg'
												}
											]
										}
									}
								}
							}
						}
					: {})
			}
		});

		if (i % 20 === 0) console.log(`Created ${i + 1}/${TOTAL} accounts`);
	}

	console.log('✅ Seeding complete!');
}

main()
	.catch(e => {
		console.error(e);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());
