package com.example.user_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.user_backend.mapper.UserMapper;
import com.example.user_backend.model.User;

@Service
public class UserService {
	private final UserMapper userMapper;

	public UserService(UserMapper userMapper) {
		this.userMapper = userMapper;
	}

	public List<User> getAllUsers() {
		return userMapper.findAll();
	}

	public int create(User user) {
		return userMapper.create(user);
	}

	public int update(User user) {
		return userMapper.update(user);
	}

	public int delete(Long id) {
		return userMapper.delete(id);
	}
	
	public List<User> getPageItems(int page, int size) {
        int p = Math.max(1, page);
        int s = Math.max(1, size);
        int offset = (p - 1) * s;
        return userMapper.findPage(s, offset);
    }

    public long countUsers() {
        return userMapper.countAll();
    }
}
