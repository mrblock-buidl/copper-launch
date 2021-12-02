-- DROP TABLE `Token`
CREATE TABLE `Token` (
    `id` serial PRIMARY KEY,
    `name` text,
    `symbol` text,
    `address` varchar(42),
    `decimals` integer,
    UNIQUE KEY(`address`)
);

-- DROP TABLE `CopperLaunchProject`
CREATE TABLE `CopperLaunchProject` (
    `id` serial PRIMARY KEY,
    `name` text,
    `tokenAddress` varchar(42),
    `lpTokenAddress` varchar(42),
    `endBlockIndex` integer,
    `startTimestamp` timestamp,
    `endTimestamp` timestamp,
    `createTimestamp` timestamp
);

-- DROP TABLE `CopperLaunchEvent`
CREATE TABLE `CopperLaunchEvent` (
    `id` serial PRIMARY KEY,
    `address` varchar(42),
    `blockHash` text,
    `blockNumber` integer,
    `transactionHash` varchar(66),
    `transactionIndex` integer,
    `event` text,
    `returnValues` text,
    `poolId` text,
    `tokenIn` varchar(42),
    `tokenOut` varchar(42),
    `amountIn` text,
    `amountOut` text,
    `logId` varchar(12),
    `from` varchar(42),
    `to` varchar(42),
    KEY(transactionHash),
    KEY(transactionHash, tokenIn),
    KEY(transactionHash, tokenOut),
    UNIQUE KEY(transactionHash, logId)
);

-- DROP TABLE 
CREATE TABLE `CopperLaunchDashboard` (
    `id` serial PRIMARY KEY,
    `copperLaunchProjectId` integer,
    `address` varchar(42),
    `contributed` text
);
