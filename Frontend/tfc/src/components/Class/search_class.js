import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import CustomLayout from "../../containers/Layout";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
	cardMedia: {
		paddingTop: '56.25%', // 16:9
	},
	link: {
		margin: theme.spacing(1, 1.5),
	},
	cardHeader: {
		backgroundColor:
			theme.palette.type === 'light'
				? theme.palette.grey[200]
				: theme.palette.grey[700],
	},
	postTitle: {
		fontSize: '16px',
		textAlign: 'left',
	},
	postText: {
		display: 'flex',
		justifyContent: 'left',
		alignItems: 'baseline',
		fontSize: '12px',
		textAlign: 'left',
		marginBottom: theme.spacing(2),
	},
}));

const ClassSearch = () => {
	const history = useNavigate();
	const classes = useStyles();
	const [appState, setAppState] = useState({
		search: '',
		posts: [],
	});
	const search = 'search';
	console.log('http://127.0.0.1:8000/classes/' + search + '/' + window.location.search)

	useEffect(() => {
		axios({
            method:"get",
            url: 'http://127.0.0.1:8000/classes/' + search + '/' + window.location.search,
            headers: {
                Authorization: localStorage.getItem('access_token')
                    ? 'Bearer ' + localStorage.getItem('access_token')
                    : null,
                'Content-Type': 'application/json',
				accept: 'application/json',
            },
        })
		.then((res) => {
			const allPosts = res.data.results;
			setAppState({ posts: allPosts });
			if (allPosts.length === 0){
				alert("No matching filter");
				history('/');
			}
			console.log(res.data)

		});
	}, [setAppState]);
	const [page, setPage] = useState(1);
	const totalPages = Math.ceil(appState.posts.length / 2);
	const startIndex = (page - 1) * 2;
	const endIndex = startIndex + 2;
	const paginatedData = appState.posts.slice(startIndex, endIndex);

	return (
		<CustomLayout>
			<React.Fragment>
				<Container maxWidth="md" component="main">
					<Grid container spacing={5} alignItems="flex-end">
						{paginatedData.map((post) => {
							return (
								// Enterprise card is full width at sm breakpoint
								<Grid item key={post.id} xs={12} md={4}>
									<Card className={classes.card}>
										<Link
											color="textPrimary"
											href={'/post/'}
											className={classes.link}
										>
											<CardMedia
												className={classes.cardMedia}
												image="https://source.unsplash.com/random"
												title="Image title"
											/>
										</Link>
										<CardContent className={classes.cardContent}>
											<Typography
												gutterBottom
												variant="h6"
												component="h2"
												className={classes.postTitle}
											>
												{post.name}
											</Typography>
											<div className={classes.postText}>
												<Typography color="textSecondary">
													<p>
														Class description: {post.description}
													</p>
													<p>
														Class Coach: {post.coach}
													</p>
													<p>
														Class keywords: {post.keywords}
													</p>
													<p>
														Class Capacity: {post.quantity}
													</p>
													<p>
														Start Time: {post.start_time}
													</p>
													<p>
														End Timer: {post.end_time}
													</p>
													<p>
														Class Status: {post.status}
													</p>
												</Typography>
											</div>
										</CardContent>
									</Card>
								</Grid>
							);
						})}
						<button onClick={() => setPage(page - 1)} disabled={page <= 1} >Previous</button>
						<button onClick={() => setPage(page + 1)} disabled={page >= totalPages} >Next</button>
					</Grid>
				</Container>
			</React.Fragment>
		</CustomLayout>
	);
};
export default ClassSearch;