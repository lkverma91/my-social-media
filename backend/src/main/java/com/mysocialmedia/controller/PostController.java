package com.mysocialmedia.controller;

import com.mysocialmedia.dto.PostDTO;
import com.mysocialmedia.model.Post;
import com.mysocialmedia.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping
    public ResponseEntity<List<Post>> getNewsFeed(Authentication auth) {
        String userId = (String) auth.getPrincipal();
        return ResponseEntity.ok(postService.getNewsFeed(userId));
    }

    @PostMapping
    public ResponseEntity<Post> createPost(@Valid @RequestBody PostDTO dto, Authentication auth) {
        String userId = (String) auth.getPrincipal();
        return ResponseEntity.ok(postService.createPost(dto.getContent(), userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id, Authentication auth) {
        String userId = (String) auth.getPrincipal();
        postService.deletePost(id, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Post> likePost(@PathVariable String id, Authentication auth) {
        String userId = (String) auth.getPrincipal();
        return ResponseEntity.ok(postService.likePost(id, userId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Post>> getUserPosts(@PathVariable String userId) {
        return ResponseEntity.ok(postService.getUserPosts(userId));
    }
}
