import { keccak256 } from "ethers";

/**
 * Computes a checkpoint hash from an array of values
 * @param values Array of values to hash
 * @returns Checkpoint hash
 */

export function computeCheckpointHash(values: string[]): string {
    const concatenated = values.join()
    return keccak256(Buffer.from(concatenated))
}