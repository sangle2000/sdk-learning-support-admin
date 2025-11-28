import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Copyright from "../internals/components/Copyright";
import CustomizedDataGrid from "./CustomizedDataGrid";
import StatCard from "./StatCard";
import type { StatCardProps } from "./StatCard";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useRef, useState } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import api from "../lib/axios";
import { useTheme } from "@mui/material/styles";

const data: StatCardProps[] = [
  {
    title: "Users",
    value: "14k",
    interval: "Last 30 days",
    trend: "up",
    data: [
      200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320, 360, 340,
      380, 360, 400, 380, 420, 400, 640, 340, 460, 440, 480, 460, 600, 880, 920,
    ],
  },
  {
    title: "Conversions",
    value: "325",
    interval: "Last 30 days",
    trend: "down",
    data: [
      1640, 1250, 970, 1130, 1050, 900, 720, 1080, 900, 450, 920, 820, 840, 600,
      820, 780, 800, 760, 380, 740, 660, 620, 840, 500, 520, 480, 400, 360, 300,
      220,
    ],
  },
  {
    title: "Event count",
    value: "200k",
    interval: "Last 30 days",
    trend: "neutral",
    data: [
      500, 400, 510, 530, 520, 600, 530, 520, 510, 730, 520, 510, 530, 620, 510,
      530, 520, 410, 530, 520, 610, 530, 520, 610, 530, 420, 510, 430, 520, 510,
    ],
  },
];

export default function MainGrid() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [startTransform, setStartTransform] = useState({
    x: 0,
    y: 0,
    scale: 0.5,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const DURATION = 300; // ms
  const theme = useTheme();

  const backdropBg =
    theme.palette.mode === "dark" ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.45)";
  const modalBg = theme.palette.background.paper;
  const textColor = theme.palette.text.primary;
  const panelBoxShadow =
    theme.palette.mode === "dark"
      ? "0 10px 30px rgba(0,0,0,0.8)"
      : "0 10px 30px rgba(0,0,0,0.2)";
  const inputBg = theme.palette.mode === "dark" ? "#1f2937" : "#fff";
  const inputBorder = theme.palette.divider;

  const openModal = () => {
    if (!btnRef.current) {
      setIsOpen(true);
      return;
    }

    const btnRect = btnRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // center of button
    const btnCx = btnRect.left + btnRect.width / 2;
    const btnCy = btnRect.top + btnRect.height / 2;

    // center of viewport
    const centerX = vw / 2;
    const centerY = vh / 2;

    // translation needed from button center to viewport center
    const x = btnCx - centerX;
    const y = btnCy - centerY;

    // scale start from small based on button size
    const startScale = Math.min(0.9, btnRect.width / Math.min(vw, vh) || 0.5);

    setStartTransform({ x, y, scale: startScale });
    setIsOpen(true);
    // mark animating to trigger enter animation
    requestAnimationFrame(() => setIsAnimating(true));
  };

  const closeModal = () => {
    // trigger reverse animation
    setIsAnimating(false);
    // wait for transition to finish then unmount
    setTimeout(() => setIsOpen(false), DURATION + 20);
  };

  // Close if Escape pressed
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {data.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Box className="w-full h-full flex items-center">
            <Button
              variant="contained"
              className="w-full bg-blue-900"
              ref={btnRef}
              onClick={openModal}
            >
              Add new user
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Details
      </Typography>
      <Grid container spacing={2} columns={12}>
        <CustomizedDataGrid />
      </Grid>
      <Copyright sx={{ my: 4 }} />
      {/* Modal overlay + animated dialog */}
      {isOpen && (
        <div
          aria-hidden={!isOpen}
          onClick={closeModal}
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1400,
          }}
        >
          {/* backdrop */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: backdropBg,
              transition: `opacity ${DURATION}ms ease`,
              opacity: isAnimating ? 1 : 0,
            }}
          />

          {/* modal panel */}
          <div
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            style={{
              position: "relative",
              width: 640,
              maxWidth: "90%",
              background: modalBg,
              borderRadius: 8,
              boxShadow: panelBoxShadow,
              transformOrigin: "center center",
              transition: `transform ${DURATION}ms ease, opacity ${DURATION}ms ease`,
              // when animating, move to center (no translate) and full scale
              transform: isAnimating
                ? "translate3d(0,0,0) scale(1)"
                : `translate3d(${startTransform.x}px, ${startTransform.y}px, 0) scale(${startTransform.scale})`,
              opacity: isAnimating ? 1 : 0,
              zIndex: 1,
              padding: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: textColor,
                  fontWeight: 600,
                  fontSize: "1.5rem",
                }}
              >
                Add new user
              </h3>
              <IconButton size="small" onClick={closeModal} aria-label="close">
                <CloseIcon />
              </IconButton>
            </div>

            <form
              style={{ marginTop: 16 }}
              onSubmit={async (e) => {
                e.preventDefault();
                if (isSubmitting) return;
                setIsSubmitting(true);
                try {
                  const fd = new FormData(e.currentTarget as HTMLFormElement);
                  const name = (fd.get('name') as string) || '';
                  const email = (fd.get('email') as string) || '';
                  const role = (fd.get('role') as string) || undefined;

                  await api.post('/user/create-user', { name, email, role });
                  closeModal();
                } catch (err) {
                  console.error('Create user failed', err);
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              {/* Simple form skeleton - adapt as needed */}
              <label
                style={{
                  display: "block",
                  textAlign: "start",
                  marginBottom: 8,
                  color: theme.palette.text.secondary,
                }}
              >
                Name
                <input
                  name="name"
                  style={{
                    width: "100%",
                    padding: 8,
                    marginTop: 6,
                    background: inputBg,
                    color: textColor,
                    border: `1px solid ${inputBorder}`,
                    borderRadius: 4,
                  }}
                />
              </label>
              <label
                style={{
                  display: "block",
                  textAlign: "start",
                  marginBottom: 8,
                  color: theme.palette.text.secondary,
                }}
              >
                Email
                <input
                  name="email"
                  type="email"
                  style={{
                    width: "100%",
                    padding: 8,
                    marginTop: 6,
                    background: inputBg,
                    color: textColor,
                    border: `1px solid ${inputBorder}`,
                    borderRadius: 4,
                  }}
                />
              </label>

              <label
                style={{
                  display: "block",
                  textAlign: "start",
                  marginBottom: 8,
                  color: theme.palette.text.secondary,
                }}
              >
                Role
                <select
                  name="role"
                  defaultValue="User"
                  style={{
                    width: "100%",
                    padding: 8,
                    marginTop: 6,
                    background: inputBg,
                    color: textColor,
                    border: `1px solid ${inputBorder}`,
                    borderRadius: 4,
                  }}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </label>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 8,
                  marginTop: 12,
                }}
              >
                <Button variant="outlined" color="error" onClick={closeModal}>
                  Cancel
                </Button>
                <Button variant="contained" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <CircularProgress size={18} color="inherit" /> : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Box>
  );
}
