'use server'

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface SftpCredentials {
    connectionString: string;
    username: string;
    password: string;
    port: number;
}

// server-side decryption matching your java AES/ECB/PKCS5Padding setup
function decryptPassword(encryptedPassword: string): string {
    const crypto = require('crypto');

    if (!process.env.PASSWORD_KEY) {
        throw new Error('encryption key not configured');
    }

    if (!encryptedPassword) {
        throw new Error('encrypted password is empty or undefined');
    }

    try {
        const key = Buffer.from(process.env.PASSWORD_KEY, 'base64');
        const decipher = crypto.createDecipheriv('aes-256-ecb', key, null);

        let decrypted = decipher.update(encryptedPassword, 'base64', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    } catch (error) {
        // @ts-ignore
        throw new Error(`decryption failed: ${error.message}`);
    }
}

export async function getSftpCredentials(subscriptionId: string): Promise<SftpCredentials> {
    const { userId } = await auth();

    if (!userId) {
        redirect('/sign-in');
    }

    if (!process.env.API_URL) {
        throw new Error('api url not configured');
    }

    try {
        const response = await fetch(
            `${process.env.API_URL}/api/panel/user/${userId}/subscription/${subscriptionId}/sftp/credentials`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error(`failed to fetch credentials: ${response.status}`);
        }

        const data = await response.json();

        // decrypt the password server-side
        const decryptedPassword = decryptPassword(data.encrypted_password);

        return {
            connectionString: data.connection_string,
            username: data.username,
            password: decryptedPassword,
            port: data.port,
        };
    } catch (error) {
        throw new Error(`couldn't load sftp credentials: ${error}`);
    }
}