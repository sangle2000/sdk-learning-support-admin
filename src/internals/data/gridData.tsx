import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import type { GridCellParams, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

type SparkLineData = number[];

function getDaysInMonth(month: number, year: number) {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString('en-US', {
    month: 'short',
  });
  const daysInMonth = date.getDate();
  const days = [];
  let i = 1;
  while (days.length < daysInMonth) {
    days.push(`${monthName} ${i}`);
    i += 1;
  }
  return days;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderSparklineCell(params: GridCellParams<SparkLineData, any>) {
  const data = getDaysInMonth(4, 2024);
  const { value, colDef } = params;

  if (!value || value.length === 0) {
    return null;
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <SparkLineChart
        data={value}
        width={colDef.computedWidth || 100}
        height={32}
        plotType="bar"
        showHighlight
        showTooltip
        color="hsl(210, 98%, 42%)"
        xAxis={{
          scaleType: 'band',
          data,
        }}
      />
    </div>
  );
}

function renderStatus(status: 'Online' | 'Offline') {
  const colors: { [index: string]: 'success' | 'default' } = {
    Online: 'success',
    Offline: 'default',
  };

  return <Chip label={status} color={colors[status]} size="small" />;
}

export function renderAvatar(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: GridCellParams<{ name: string; color: string }, any, any>,
) {
  if (params.value == null) {
    return '';
  }

  return (
    <Avatar
      sx={{
        backgroundColor: params.value.color,
        width: '24px',
        height: '24px',
        fontSize: '0.85rem',
      }}
    >
      {params.value.name.toUpperCase().substring(0, 1)}
    </Avatar>
  );
}

export const columns: GridColDef[] = [
  { field: 'user', headerName: 'User', flex: 1.5, minWidth: 200 },
  {
    field: 'status',
    headerName: 'Status',
    flex: 0.5,
    minWidth: 80,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderCell: (params) => renderStatus(params.value as any),
  },
  {
    field: 'email',
    headerName: 'Email',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    minWidth: 80,
  },
  {
    field: 'role',
    headerName: 'Role',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    minWidth: 100,
  },
  {
    field: 'joinTime',
    headerName: 'Join Time',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    minWidth: 120,
  },
  {
    field: 'onlineTime',
    headerName: 'Online Time',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    minWidth: 100,
  },
  {
    field: 'conversions',
    headerName: 'Daily Conversions',
    flex: 1,
    minWidth: 150,
    renderCell: renderSparklineCell,
  },
];

export const rows: GridRowsProp = [
  {
    id: 1,
    user: 'Lê Hà Thanh Sang',
    status: 'Online',
    email: "sanglht2000@gmail.com",
    role: "Admin",
    joinTime: "3d 13h",
    onlineTime: '2m 15s',
    conversions: [
      469172, 488506, 592287, 617401, 640374, 632751, 668638, 807246, 749198, 944863,
      911787, 844815, 992022, 1143838, 1446926, 1267886, 1362511, 1348746, 1560533,
      1670690, 1695142, 1916613, 1823306, 1683646, 2025965, 2529989, 3263473,
      3296541, 3041524, 2599497,
    ],
  },
];
