import { describe, expect, test, afterAll } from '@jest/globals';
import { personalSign } from "@metamask/eth-sig-util";
import { Wallet, verifyMessage, encodeBase64, toUtf8Bytes, decodeBase64, toUtf8String } from "ethers";
import { signMessageWithNonce, verifyAndExtractMessage, getNonce } from "../src/utils/ethereum_utils"
import { pool } from "../src/utils/db_utils"

const ADMIN_ADDRESS = "0x1a67b91acE32823a75da86104E8931cc94f2C9D8";
const ADMIN_PRIVATE_KEY = "0x4eebc178b279a5f094030be6fca77ae39e664e1f54a79aece4372347f0a8cb4f";

describe("Testing Ethereum signing and verification", () => {

    afterAll(async () => {
        await pool.end();
    });

    test("Sign and verify message", () => {
        const wallet = Wallet.createRandom();
        const message = "Hello, this is a test message";

        const metamaskSignature = personalSign({ privateKey: Buffer.from(wallet.privateKey.slice(2), 'hex'), data: message })
        const ethersSignature = wallet.signMessageSync(message)
        expect(metamaskSignature).toBe(ethersSignature);

        const address = verifyMessage(message, ethersSignature)
        expect(address).toBe(wallet.address);
    })

    test("JSON signing and verify", () => {
        const content = {
            foo: 123,
            bar: 456
        }

        const wallet = Wallet.createRandom();

        const base64content = encodeBase64(toUtf8Bytes(JSON.stringify(content)))
        const signature = wallet.signMessageSync(base64content)
        const envelope = {
            content: base64content,
            signature: signature,
            address: wallet.address
        }

        const address = verifyMessage(envelope.content, envelope.signature)
        expect(address).toBe(envelope.address)

        const parsed_content = JSON.parse(toUtf8String(decodeBase64(envelope.content)))
        expect(JSON.stringify(parsed_content)).toBe(JSON.stringify(content))
    })

    test("Sign and verify with Ethereum utils", async () => {
        const message = {
            foo: 123,
            bar: 456
        }

        const nonce = await getNonce(ADMIN_ADDRESS);
        const payload = await signMessageWithNonce(message, ADMIN_PRIVATE_KEY, nonce)
        const [extractedMessage, address] = await verifyAndExtractMessage(payload);

        expect(JSON.stringify(extractedMessage)).toBe(JSON.stringify(message))
        expect(address).toBe(ADMIN_ADDRESS)
    })

});