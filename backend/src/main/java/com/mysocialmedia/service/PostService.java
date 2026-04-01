package com.mysocialmedia.service;

import com.mysocialmedia.model.Post;
import com.mysocialmedia.model.User;
import com.mysocialmedia.repository.CommentRepository;
import com.mysocialmedia.repository.PostRepository;
import com.mysocialmedia.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;

    public Post createPost(String content, String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = new Post();
        post.setUserId(userId);
        post.setUsername(user.getUsername());
        post.setContent(content);
        post.setLikes(new ArrayList<>());
        post.setCreatedAt(LocalDateTime.now());

        return postRepository.save(post);
    }

    public void deletePost(String postId, String userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        if (!post.getUserId().equals(userId)) {
            throw new RuntimeException("You can only delete your own posts");
        }
        commentRepository.deleteByPostId(postId);
        postRepository.delete(post);
    }

    public Post likePost(String postId, String userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (post.getLikes().contains(userId)) {
            post.getLikes().remove(userId);
        } else {
            post.getLikes().add(userId);
        }

        return postRepository.save(post);
    }

    public List<Post> getNewsFeed(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<String> feedUserIds = new ArrayList<>(user.getFollowing());
        feedUserIds.add(userId);

        return postRepository.findByUserIdInOrderByCreatedAtDesc(feedUserIds);
    }

    public List<Post> getUserPosts(String userId) {
        return postRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
