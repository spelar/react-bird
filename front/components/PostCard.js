import { Card, Button, Popover, Avatar, List, Comment } from "antd"
import { RetweetOutlined, HeartOutlined, MessageOutlined, EllipsisOutlined, HeartTwoTone } from '@ant-design/icons';
import { useSelector, useDispatch } from "react-redux";
import PropTypes from 'prop-types';
import PostImages from './PostImages';
import { useState, useCallback } from "react";
import CommentForm from "./CommentForm";
import PostCardContent from "./PostCardContent";
import { REMOVE_POST_REQUEST, LIKE_POST_REQUEST, UNLIKE_POST_REQUEST, RETWEET_REQUEST, UPDATE_POST_REQUEST } from "../reducers/post";
import FollowButton from './FollowButton';
import Link from 'next/link';
import moment from 'moment';

moment.locale('ko');

const PostCard = ({ post }) => {
	const dispatch = useDispatch();
	const { removePostLoading } = useSelector((state) => state.post);
	const id = useSelector((state) => state.user.me?.id);
	const [commentFormOpened, setCommentFormOpened] = useState(false);
	const liked = post.Likers.find((v) => v.id === id);
	const [editMode, setEditMode] = useState(false);

	const onLike = useCallback(() => {
		if (!id) {
			return alert("로그인이 필요합니다.");
		}
		return dispatch({
			type: LIKE_POST_REQUEST,
			data: post.id
		});
	}, [id]);

	const onUnlike = useCallback(() => {
		if (!id) {
			return alert("로그인이 필요합니다.");
		}
		return dispatch({
			type: UNLIKE_POST_REQUEST,
			data: post.id
		})
	}, [id]);

	const onToggleComment = useCallback(() => {
    setCommentFormOpened((prev) => !prev);
  }, []);

	const onRemovePost = useCallback(() => {
		if (!id) {
			return alert("로그인이 필요합니다.");
		}
		return dispatch({
			type: REMOVE_POST_REQUEST,
			data: post.id
		})
	}, [id]);

	const onRetweet = useCallback(() => {
		if (!id) {
			return alert("로그인이 필요합니다.");
		}
		return dispatch({
			type: RETWEET_REQUEST,
			data: post.id
		})
	}, [id]);

	const onClickUpdate = useCallback(() => {
		setEditMode(true);
	}, []);

		const onCancelUpdate = useCallback(() => {
			setEditMode(false);
		}, []);

		const onChangePost = useCallback((editText) => () => {
			dispatch({
				type: UPDATE_POST_REQUEST,
				data: {
					PostId: post.id,
					content: editText
				}
			})
		}, [post]);

	return (
		<div style={{ marginBottom: 20 }}>
			<Card 
				cover={post.Images[0] && <PostImages images={post.Images} />}
				actions={[
					<RetweetOutlined key="retweet" onClick={onRetweet} />,
					liked ? <HeartTwoTone twoToneColor="#eb2f96" key="heart" onClick={onUnlike} /> : <HeartOutlined key="heart" onClick={onLike} />,
					<MessageOutlined key="comment" onClick={onToggleComment} />,
					<Popover key="more" content={(
						<Button.Group>
							{id && post.User.id === id ? (
							<>
								{!post.RetweetId && <Button onClick={onClickUpdate}>수정</Button>}
								<Button type="danger" onClick={onRemovePost} loading={removePostLoading}>삭제</Button>
							</>
							) : <Button>신고</Button>}
						</Button.Group>
					)}>
						<EllipsisOutlined />
					</Popover>
				]}
				title={post.RetweetId ? `${post.User.nickname}님이 리트윗하셨습니다.` : null}
				extra={ id && <FollowButton post={post} />}
			>
				{post.RetweetId && post.Retweet
          ? (
            <Card
              cover={post.Retweet.Images[0] && <PostImages images={post.Retweet.Images} />}
            >
							<div style={{ float: 'right' }}>{moment(post.createdAt).format('YYYY.MM.DD')}</div>
              <Card.Meta
                avatar={<Link href={`/user/${post.Retweet.User.id}`} prefetch={false}><a><Avatar>{post.Retweet.User.nickname[0]}</Avatar></a></Link>}
                title={post.Retweet.User.nickname}
                description={<PostCardContent postData={post.Retweet.content} onCancelUpdate={onCancelUpdate} onChangePost={onChangePost} />}
              />
            </Card>
          )
          : (
            <>
						<div style={{ float: 'right' }}>{moment(post.createdAt).format('YYYY.MM.DD')}</div>
              <Card.Meta
                avatar={<Link href={`/user/${post.User.id}`} prefetch={false}><a><Avatar>{post.User.nickname[0]}</Avatar></a></Link>}
                title={post.User.nickname}
                description={<PostCardContent editMode={editMode} postData={post.content} onCancelUpdate={onCancelUpdate} onChangePost={onChangePost} />}
              />
            </>
          )}
      </Card>
			{commentFormOpened && (
				<>
					<CommentForm post={post} />	
					<List
						header={`${post.Comments.length} 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments}
            renderItem={(item) => (
							<li>
								<Comment
									author={item.User.nickname}
									avatar={<Link href={`/user/${item.User.id}`} prefetch={false}><a><Avatar>{item.User.nickname[0]}</Avatar></a></Link>}
									content={item.content}
								/>
							</li>
						)}
					/>
				</>
			)}
		</div>
	)
}

PostCard.propTypes = {
	post: PropTypes.shape({
		id: PropTypes.number,
		User: PropTypes.object,
		content: PropTypes.string,
		createdAt: PropTypes.string,
		Comments: PropTypes.arrayOf(PropTypes.object),
		Images: PropTypes.arrayOf(PropTypes.object),
		Likers: PropTypes.arrayOf(PropTypes.object),
		RetweetId: PropTypes.number,
		Retweet: PropTypes.objectOf(PropTypes.any)
	}).isRequired
}

export default PostCard;