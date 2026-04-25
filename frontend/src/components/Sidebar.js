import { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import { Button, Grid, Menu, MenuItem, Typography } from "@mui/material";
import Image from "mui-image";
import { ExpandMore } from "@mui/icons-material";

import Accordion from "./Accordion.js";
import useGlobalState from "../use-global-state.js";

import { jwt } from "../utils/index.js";

const useStyles = makeStyles((theme) => ({
	sidebar: {
		height: "100%",
		position: "absolute",
		backgroundColor: theme.palette.secondary.main,
		color: "white",
		overflow: "auto",
	},
}));

const ButtonWithText = ({ text, icon, more, handler, dataTestId }) => (
	<span key={text}>
		{!more
		&& (
			<Button key={text} sx={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "flex-start", padding: "8px 40px 8px 16px" }} onClick={(event) => handler(event)} data-testid={dataTestId}>
				{icon && (<Image src={icon} alt={text} fit="contain" width="25px" />)}
				<Typography align="center" color="white.main" fontSize="medium" ml={1} display="flex" alignItems="center" sx={{ textTransform: "capitalize" }}>
					{text}
					{more && <ExpandMore />}
				</Typography>
			</Button>
		)}
		{more
		&& (
			<Accordion
				key={text}
				title={(
					<Grid item sx={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "flex-start" }}>
						<Image src={icon} alt={text} fit="contain" width="25px" />
						<Typography align="center" color="white.main" fontSize="medium" ml={1} display="flex" alignItems="center" sx={{ textTransform: "capitalize" }}>
							{text}
						</Typography>
					</Grid>
				)}
				content={(
					<Grid container flexDirection="column" width="100%">
						{more.map((el) => (
							<Button key={el.title} color="white" onClick={el.handler}>
								<Typography sx={{ textTransform: "capitalize" }}>{el.title}</Typography>
							</Button>
						))}
					</Grid>
				)}
				alwaysExpanded={false}
				titleBackground="transparent"
				expandIconColor="white"
			/>
		)}
	</span>
);

const ButtonSimple = ({ text, icon, handler, ind }) => (
	<Button key={text} sx={{ minWidth: "30px!important", padding: "0px", marginTop: (ind === 0) ? "0px" : "10px" }} onClick={(event) => handler(event)}>
		<Image src={icon} alt={text} fit="contain" width="30px" />
	</Button>
);

const Sidebar = ({ isSmall: sidebarIsSmall }) => {
	const [isSmall, setIsSmall] = useState(false);
	const navigate = useNavigate();
	const classes = useStyles();
	const favorites = useGlobalState((state) => state.favorites || []);

	const isAdmin = jwt.isAdmin();

	useEffect(() => setIsSmall(sidebarIsSmall), [sidebarIsSmall]);

	const dashboardItems = [
		{
			key: "dashboard",
			text: "Overview",
			handler: () => navigate("/dashboard"),
			favoriteTestId: "sidebar-favorite-dashboard",
		},
		{
			key: "dashboard1",
			text: "Analytics",
			handler: () => navigate("/dashboard1"),
			favoriteTestId: "sidebar-favorite-dashboard1",
		},
		{
			key: "dashboard2",
			text: "Insights",
			handler: () => navigate("/dashboard2"),
			favoriteTestId: "sidebar-favorite-dashboard2",
		},
	];

	const buttons = [
		...(isAdmin ? [{
			text: "Users",
			handler: () => {
				navigate("/users");
			},
		}] : []),
		...dashboardItems,
	];

	return (
		<div className={classes.sidebar} style={{ width: (isSmall) ? "50px" : "200px", padding: (isSmall) ? "20px 5px" : "20px 5px", textAlign: "center" }}>
			{!isSmall && favorites.length > 0 && (
				<div data-testid="sidebar-favorites-section">
					<Typography variant="subtitle2" color="white.main" sx={{ textAlign: "left", pl: 2, mb: 1 }}>
						Favorites
					</Typography>
					{favorites.map((favoriteKey) => {
						const item = dashboardItems.find((dashboard) => dashboard.key === favoriteKey);
						return item ? (
							<ButtonWithText
								key={`fav-${item.key}`}
								icon={item.icon}
								text={item.text}
								handler={item.handler}
								more={item.more}
								dataTestId={item.favoriteTestId}
							/>
						) : null;
					})}
				</div>
			)}
			{!isSmall && buttons.map((button) => (
				<ButtonWithText
					key={button.text}
					icon={button.icon}
					text={button.text}
					handler={button.handler}
					more={button.more}
				/>
			))}
			{isSmall && buttons.map((button, ind) => (
				<ButtonSimple
					key={button.text}
					icon={button.icon}
					text={button.text}
					handler={button.handler}
					more={button.more}
					ind={ind}
				/>
			))}
		</div>
	);
};

export default Sidebar;
