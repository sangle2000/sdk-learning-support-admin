import { DataGrid, type GridRowsProp } from "@mui/x-data-grid";
import { columns } from "../internals/data/gridData";
import { useState, useEffect } from "react";
import api from "../lib/axios";
import { useAuthStore } from "../stores/auth";

interface IUserData {
  id: number;
  email: string;
  name: string;
  role: string;
  status: string;
}

export default function CustomizedDataGrid() {
  const [userDetail, setUserDetail] = useState<GridRowsProp[]>([]);

  const socket = useAuthStore((state) => state.socket);

  useEffect(() => {
    if (!socket) return;

    socket.on(
      "user-online",
      (user: {
        id: number;
        user: string;
        email: string;
        role: string;
        status: string;
      }) => {
        setUserDetail((prev) => {
          // nếu user đã có → chỉ update status
          if (prev.find((u) => u.id === user.id)) {
            return prev.map((u) => {
              return u.id === user.id ? { ...u, status: "Online" } : u;
            });
          }
          // nếu chưa có → thêm vào state
          return [...prev, { ...user, status: "Online" }];
        });
      }
    );

    socket.on("user-offline", (userId: { id: number }) => {
      setUserDetail((prev) =>
        prev.map((u) =>
          parseInt(u.id) === userId.id ? { ...u, status: "Offline" } : u
        )
      );
    });

    // 1️⃣ Lấy danh sách online ban đầu
    const fetchOnlineUsers = async () => {
      const res = await api.get("/auth/online-users");

      if (res.data.length > 0) {
        const userData = res.data.map((user: IUserData) => ({
          id: user.id,
          email: user.email,
          user: user.name,
          status: user.status,
          role: user.role,
          joinTime: "3d 13h",
          onlineTime: "2m 15s",
          conversions: [
            469172, 488506, 592287, 617401, 640374, 632751, 668638, 807246,
            749198, 944863, 911787, 844815, 992022, 1143838, 1446926, 1267886,
            1362511, 1348746, 1560533, 1670690, 1695142, 1916613, 1823306,
            1683646, 2025965, 2529989, 3263473, 3296541, 3041524, 2599497,
          ],
        }));

        setUserDetail(userData);
      }
    };
    fetchOnlineUsers();
  }, [socket]);

  return (
    <DataGrid
      checkboxSelection
      rows={userDetail}
      columns={columns}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
      }
      initialState={{
        pagination: { paginationModel: { pageSize: 20 } },
      }}
      pageSizeOptions={[10, 20, 50]}
      disableColumnResize
      density="compact"
      slotProps={{
        filterPanel: {
          filterFormProps: {
            logicOperatorInputProps: {
              variant: "outlined",
              size: "small",
            },
            columnInputProps: {
              variant: "outlined",
              size: "small",
              sx: { mt: "auto" },
            },
            operatorInputProps: {
              variant: "outlined",
              size: "small",
              sx: { mt: "auto" },
            },
            valueInputProps: {
              InputComponentProps: {
                variant: "outlined",
                size: "small",
              },
            },
          },
        },
      }}
    />
  );
}
