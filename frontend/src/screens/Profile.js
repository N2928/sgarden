import { useState, useEffect } from "react";
import { Box, Typography, Button, TextField, Grid, Paper, Divider } from "@mui/material";
import { Edit as EditIcon, Save as SaveIcon, Lock as LockIcon } from "@mui/icons-material";

import { api, useSnackbar } from "../utils/index.js";
import Form from "../components/Form.js";

const Profile = () => {
	const [profile, setProfile] = useState(null);
	const [editing, setEditing] = useState(false);
	const [formData, setFormData] = useState({ username: "", email: "" });
	const [passwordData, setPasswordData] = useState({ current: "", new: "", confirm: "" });
	const { showSnackbar } = useSnackbar();

	useEffect(() => {
		fetchProfile();
	}, []);

	const fetchProfile = async () => {
		try {
			const response = await api.get("/user/profile");
			if (response.success) {
				setProfile(response.profile);
				setFormData({ username: response.profile.username, email: response.profile.email });
			}
		} catch (error) {
			showSnackbar("Failed to load profile", "error");
		}
	};

	const handleEditToggle = () => {
		setEditing(!editing);
		if (!editing) {
			setFormData({ username: profile.username, email: profile.email });
		}
	};

	const handleSave = async () => {
		try {
			const response = await api.put("/user/profile", formData);
			if (response.success) {
				setProfile({ ...profile, ...formData });
				setEditing(false);
				showSnackbar("Profile updated successfully", "success");
			} else {
				showSnackbar(response.message || "Failed to update profile", "error");
			}
		} catch (error) {
			showSnackbar("Failed to update profile", "error");
		}
	};

	const handlePasswordChange = async () => {
		if (passwordData.new !== passwordData.confirm) {
			showSnackbar("New passwords do not match", "error");
			return;
		}
		try {
			const response = await api.put("/user/profile/password", {
				currentPassword: passwordData.current,
				newPassword: passwordData.new,
			});
			if (response.success) {
				setPasswordData({ current: "", new: "", confirm: "" });
				showSnackbar("Password changed successfully", "success");
			} else {
				showSnackbar(response.message || "Failed to change password", "error");
			}
		} catch (error) {
			showSnackbar("Failed to change password", "error");
		}
	};

	if (!profile) return <Typography>Loading...</Typography>;

	return (
		<Box sx={{ p: 3 }} data-testid="profile-page">
			<Typography variant="h4" gutterBottom>Profile</Typography>
			<Paper sx={{ p: 3, mb: 3 }}>
				<Typography variant="h6" gutterBottom>Account Information</Typography>
				<Grid container spacing={2}>
					<Grid item xs={12} sm={6}>
						<TextField
							fullWidth
							label="Username"
							value={editing ? formData.username : profile.username}
							onChange={(e) => setFormData({ ...formData, username: e.target.value })}
							disabled={!editing}
							data-testid="profile-username"
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							fullWidth
							label="Email"
							value={editing ? formData.email : profile.email}
							onChange={(e) => setFormData({ ...formData, email: e.target.value })}
							disabled={!editing}
							data-testid="profile-email"
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							fullWidth
							label="Role"
							value={profile.role}
							disabled
							data-testid="profile-role"
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							fullWidth
							label="Account Created"
							value={new Date(profile.createdAt).toLocaleDateString()}
							disabled
							data-testid="profile-created-at"
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							fullWidth
							label="Last Active"
							value={new Date(profile.lastActiveAt).toLocaleDateString()}
							disabled
							data-testid="profile-last-active"
						/>
					</Grid>
				</Grid>
				<Box sx={{ mt: 2 }}>
					<Button
						variant="outlined"
						startIcon={<EditIcon />}
						onClick={handleEditToggle}
						data-testid="profile-edit-button"
					>
						{editing ? "Cancel" : "Edit"}
					</Button>
					{editing && (
						<Button
							variant="contained"
							startIcon={<SaveIcon />}
							onClick={handleSave}
							sx={{ ml: 1 }}
							data-testid="profile-save-button"
						>
							Save
						</Button>
					)}
				</Box>
			</Paper>
			<Paper sx={{ p: 3 }}>
				<Typography variant="h6" gutterBottom>Change Password</Typography>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<TextField
							fullWidth
							label="Current Password"
							type="password"
							value={passwordData.current}
							onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
							data-testid="profile-password-current"
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							fullWidth
							label="New Password"
							type="password"
							value={passwordData.new}
							onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
							data-testid="profile-password-new"
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							fullWidth
							label="Confirm New Password"
							type="password"
							value={passwordData.confirm}
							onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
							data-testid="profile-password-confirm"
						/>
					</Grid>
				</Grid>
				<Box sx={{ mt: 2 }}>
					<Button
						variant="contained"
						startIcon={<LockIcon />}
						onClick={handlePasswordChange}
						data-testid="profile-password-save"
					>
						Change Password
					</Button>
				</Box>
			</Paper>
		</Box>
	);
};

export default Profile;