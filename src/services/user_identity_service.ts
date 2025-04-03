import { Identity } from "@semaphore-protocol/identity"
import { runQuery } from "../utils/db_utils";
import { computeCheckpointHash } from "../utils/checkpoint_utils";
import { hexlify, keccak256, toUtf8Bytes, randomBytes } from "ethers";

/**
 * Creates and stores a user identity for the given address
 * @param address Ethereum address of the user
 * @returns The created identity and its commitment
 */
export async function createUserIdentity(address: string): Promise<{ encryptedPrivateKey: string, salt: string,  commitment: string}>{

	// get the user address and hash using ethers keccak256
	const hashedAddress = keccak256(toUtf8Bytes(address))

	const identity = new Identity(hashedAddress)

	// get the last checkpoint hash
	const lastCheckpointRows = await runQuery(
		"SELECT checkpoint_hash FROM user_identities ORDER BY id DESC LIMIT 1"
	);

	const lastCheckpointHash = lastCheckpointRows.length > 0
		? lastCheckpointRows[0].checkpoint_hash
		:  '0x00';

	const privateKey = identity.export();

	const salt = hexlify(randomBytes(32)); // generate random salt

	// Derive encryption key from address and salt
	//const encryptionKey = keccak256(toUtf8Bytes(address + salt));

	// Encrypt the private key
  	//had issues with encrypting the private key
	//const encryptedPrivateKey = encrypt(privateKey, encryptionKey.slice(2)); // Remove 0x prefix
  	const encryptedPrivateKey = privateKey;
	// ideally we should encrypt this privateKey, so we can decrypt it on the client side

	const commitment = identity.commitment.toString();

	const checkpointHash = computeCheckpointHash([
		lastCheckpointHash,
		address,
		commitment,
		privateKey
	]);

	// insert new Identity
    await runQuery(
        "INSERT INTO user_identities (address, commitment, encrypted_private_key, salt, checkpoint_hash) VALUES (?, ?, ?, ?, ?)",
        [address, commitment, encryptedPrivateKey, salt, checkpointHash]
    );

    return { encryptedPrivateKey, salt, commitment };
}

/**
 * Retrieves a user's identity by their Ethereum address
 * @param address Ethereum address of the user
 * @returns The user's identity information if found
 */
export async function getUserIdentity(address: string): Promise<{ encryptedPrivateKey: string, salt: string, commitment: string } | null> {
  const rows = await runQuery(
    "SELECT encrypted_private_key, salt, commitment FROM user_identities WHERE address = ?",
    [address]
  );

  if (rows.length === 0) {
    return null;
  }

  return {
    encryptedPrivateKey: rows[0].encrypted_private_key,
	salt: rows[0].salt,
    commitment: rows[0].commitment
  };
}

/**
 * Gets or creates a user identity for the given address
 * @param address Ethereum address of the user
 * @returns The user's identity information
 */
export async function getOrCreateUserIdentity(address: string): Promise<{ encryptedPrivateKey: string, salt: string, commitment: string }> {
  const existingIdentity = await getUserIdentity(address);

  if (existingIdentity) {
    return existingIdentity;
  }

  return createUserIdentity(address);
}