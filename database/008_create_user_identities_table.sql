CREATE TABLE `user_identities` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `address` VARCHAR(42) NOT NULL,
    `commitment` VARCHAR(255) NOT NULL,
    `encrypted_private_key` VARCHAR(1024) NOT NULL,
    `salt` VARCHAR(255) NOT NULL,
    `checkpoint_hash` VARCHAR(66) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_address` (`address`),
    INDEX `index_user_identities_address` (`address`),
    INDEX `index_user_identities_commitment` (`commitment`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;