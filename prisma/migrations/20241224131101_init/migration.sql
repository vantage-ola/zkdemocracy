-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "creator" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Voting" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "creator" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Voting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VotingGroup" (
    "votingsId" INTEGER NOT NULL,
    "groupsId" INTEGER NOT NULL,
    "creator" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VotingGroup_pkey" PRIMARY KEY ("votingsId","groupsId")
);

-- CreateTable
CREATE TABLE "GroupAdmin" (
    "groupsId" INTEGER NOT NULL,
    "admin" TEXT NOT NULL,
    "creator" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupAdmin_pkey" PRIMARY KEY ("groupsId","admin")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" SERIAL NOT NULL,
    "groupsId" INTEGER NOT NULL,
    "commitment" TEXT NOT NULL,
    "identityHash" TEXT NOT NULL,
    "merkleRoot" TEXT NOT NULL,
    "checkpointHash" TEXT NOT NULL,
    "proof" TEXT,
    "creator" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" SERIAL NOT NULL,
    "votingsId" INTEGER NOT NULL,
    "groupsId" INTEGER NOT NULL,
    "nullifier" TEXT NOT NULL,
    "merkleRoot" TEXT NOT NULL,
    "proof" TEXT NOT NULL,
    "vote" TEXT NOT NULL,
    "checkpointHash" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nonce" (
    "address" TEXT NOT NULL,
    "nonce" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Nonce_pkey" PRIMARY KEY ("address")
);

-- CreateIndex
CREATE UNIQUE INDEX "Group_uuid_key" ON "Group"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Voting_uuid_key" ON "Voting"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Member_groupsId_identityHash_key" ON "Member"("groupsId", "identityHash");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_groupsId_votingsId_nullifier_key" ON "Vote"("groupsId", "votingsId", "nullifier");
