import { Form, Button, Input } from "antd";
import { useCallback, useEffect } from "react";
import useInput from "../hooks/useInput";
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from "react-redux";
import { ADD_COMMENT_REQUEST } from '../reducers/post';

const CommentForm = ({ post }) => {
	const dispatch = useDispatch();
	const { addCommentDone, addCommentLoading } = useSelector(state => state.post);
	const id = useSelector((state) => state.user.me?.id);
	const [commentText, onChangeCommentText, setCommentText] = useInput('');

	useEffect(() => {
		if (addCommentDone) {
			setCommentText('');
		 }
	}, [addCommentDone]);

	const onSubmitComment = useCallback(() => {
		dispatch({
			type: ADD_COMMENT_REQUEST,
			data: {
				content: commentText,
				postId: post.id,
				userId: id
			}
		})
	}, [commentText, id]);

	return (
		<Form onFinish={onSubmitComment}>
			<Form.Item style={{ position: 'relative', margin: 0 }}>
				<Input.TextArea value={commentText} onChange={onChangeCommentText} rows={4} />
				<Button style={{ position: 'absolute', right: 0, bottom: -40, zIndex: 1, }} loading={addCommentLoading} type="primary" htmlType="submit">삐약</Button>
			</Form.Item>
		</Form>
	)
};

CommentForm.propTypes = {
	post: PropTypes.object.isRequired
}

export default CommentForm;