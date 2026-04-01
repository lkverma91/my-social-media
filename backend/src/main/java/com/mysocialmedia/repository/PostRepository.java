package com.mysocialmedia.repository;

import com.mysocialmedia.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PostRepository extends MongoRepository<Post, String> {
    List<Post> findByUserIdOrderByCreatedAtDesc(String userId);
    List<Post> findByUserIdInOrderByCreatedAtDesc(List<String> userIds);
}
