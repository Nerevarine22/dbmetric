export type TraderCohort = {
  percent: number;
  cutoffUsd: number | null;
  wallets: number;
  totalVolumeUsd: number;
  volume24hUsd: number;
  medianVolumeUsd: number | null;
  medianVolume24hUsd: number | null;
  medianTransactions: number | null;
  medianActiveDays: number | null;
  medianPoolsCreated: number | null;
  creatorCoverageComplete: boolean;
};
