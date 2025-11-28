import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';

export default function ChangePassword() {
    const theme = useTheme();
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!password || !confirm) {
            setError('Vui lòng nhập cả hai trường.');
            return;
        }

        if (password !== confirm) {
            setError('Mật khẩu không khớp.');
            return;
        }

        // TODO: call API to change password. For now, show success.
        setSuccess('Mật khẩu đã được cập nhật.');
        setPassword('');
        setConfirm('');
        setTimeout(() => setSuccess(''), 3000);
    };

    return (
        <Box
            component="main"
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                p: 3,
                width: '100%',
            }}
        >
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ width: 420, maxWidth: '100%', bgcolor: 'background.paper', p: 3, borderRadius: 2, boxShadow: 1 }}
            >
                <Typography variant="h6" sx={{ mb: 2, color: theme.palette.text.primary }}>
                    Change Password
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {success}
                    </Alert>
                )}

                <TextField
                    label="New password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />

                <TextField
                    label="Confirm password"
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={!password || !confirm || password !== confirm}
                    >
                        Update
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}