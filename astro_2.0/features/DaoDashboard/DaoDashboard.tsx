import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import { FC } from 'react';

import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { DashboardChart } from 'astro_2.0/features/DaoDashboard/components/DashboardChart';
import { StatCard } from 'astro_2.0/features/DaoDashboard/components/StatCard';
import { StatChart } from 'astro_2.0/features/DaoDashboard/components/StatChart';
import { StatPanel } from 'astro_2.0/features/DaoDashboard/components/StatPanel';
import { Loader } from 'components/loader';

import { useDaoDashboardData } from 'astro_2.0/features/DaoDashboard/hooks';
import { formatCurrency } from 'utils/formatCurrency';

import { DaoContext } from 'types/context';


import styles from './DaoDashboard.module.scss';

interface DaoDashboardProps {
  className?: string;
  daoContext: DaoContext;
}

export const DaoDashboard: FC<DaoDashboardProps> = ({
  className,
  daoContext: { dao },
}) => {
  const { t } = useTranslation();
  const { chartData, dashboardData, toggleView, activeView, loading } =
    useDaoDashboardData();

  function renderChart() {
    if (chartData) {
      return (
        <DashboardChart
          key={activeView}
          activeView={activeView}
          data={chartData}
        />
      );
    }

    if (loading) {
      return <Loader />;
    }

    return <NoResultsView title="No data available" />;
  }

  return (
    <div className={cn(styles.root, className)}>
      {/* <DaoPurpose
        links={dao.links}
        description={dao.description}
        className={styles.descriptionSection}
      /> */}

      <div className={styles.chart}>{renderChart()}</div>
      <StatCard
        selected={activeView === 'DAO_FUNDS'}
        className={styles.funds}
        onClick={() => toggleView('DAO_FUNDS')}
      >
        <StatPanel
          title={t('daoDashboard.daoFunds')}
          value={`${formatCurrency(
            dashboardData.state?.totalDaoFunds.value ?? 0
          )} USD`}
          trend={dashboardData.state?.totalDaoFunds.growth}
        />
        {!!dashboardData.funds && dashboardData.funds.length && (
          <StatChart data={dashboardData.funds} />
        )}
      </StatCard>
      <StatCard
        selected={activeView === 'BOUNTIES'}
        className={styles.bounties}
        onClick={() => toggleView('BOUNTIES')}
      >
        <StatPanel
          title={t('daoDashboard.bounties')}
          value={dashboardData.state?.bountyCount.value}
          trend={dashboardData.state?.bountyCount.growth}
        />
      </StatCard>
      <StatCard
        selected={activeView === 'NFTS'}
        className={styles.nfts}
        onClick={() => toggleView('NFTS')}
      >
        <StatPanel
          title={t('daoDashboard.nfts')}
          value={dashboardData.state?.nftCount.value}
          trend={dashboardData.state?.nftCount.growth}
        />
      </StatCard>
      <StatCard
        selected={activeView === 'PROPOSALS'}
        className={styles.proposals}
        onClick={() => toggleView('PROPOSALS')}
      >
        <StatPanel
          title={t('daoDashboard.activeProposals')}
          value={dashboardData.state?.activeProposalCount.value}
          trend={dashboardData.state?.activeProposalCount.growth}
        />
        <StatPanel
          title={t('daoDashboard.proposalsInTotal')}
          value={dashboardData.state?.totalProposalCount.value}
          trend={dashboardData.state?.totalProposalCount.growth}
        />
      </StatCard>
    </div>
  );
};
