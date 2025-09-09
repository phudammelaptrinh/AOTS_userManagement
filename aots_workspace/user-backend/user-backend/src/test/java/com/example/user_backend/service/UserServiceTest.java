package com.example.user_backend.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.user_backend.mapper.UserMapper;
import com.example.user_backend.model.User;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    UserMapper userMapper;

    @InjectMocks
    UserService userService;

    // ====== CREATE ======
    @Test
    @DisplayName("create: trả về 1 khi mapper.insert thành công")
    void create_success() {
        User u = new User();
        u.setName("Phu");
        u.setEmail("phu@example.com");

        when(userMapper.create(u)).thenReturn(1);

        int result = userService.create(u);

        assertEquals(1, result);
        verify(userMapper).create(u);
        verifyNoMoreInteractions(userMapper);
    }

    @Test
    @DisplayName("create: trả về 0 khi mapper trả 0 (không chèn được)")
    void create_returnsZero_whenInsertFailed() {
        User u = new User();
        u.setName("Phu");
        u.setEmail("phu@example.com");

        when(userMapper.create(u)).thenReturn(0);

        int result = userService.create(u);

        assertEquals(0, result);
        verify(userMapper).create(u);
        verifyNoMoreInteractions(userMapper);
    }

    // ====== READ ALL ======
    @Test
    @DisplayName("getAllUsers: ủy quyền đúng sang mapper.findAll")
    void getAllUsers_delegatesToMapper() {
        List<User> mocked = Arrays.asList(new User(), new User());
        when(userMapper.findAll()).thenReturn(mocked);

        List<User> actual = userService.getAllUsers();

        assertEquals(2, actual.size());
        verify(userMapper).findAll();
        verifyNoMoreInteractions(userMapper);
    }

    // ====== PAGINATION ======
    @Test
    @DisplayName("getPageItems: tính offset đúng (page=2,size=5 ⇒ limit=5, offset=5)")
    void getPageItems_offset_ok() {
        when(userMapper.findPage(5, 5)).thenReturn(Collections.emptyList());
        List<User> page = userService.getPageItems(2, 5);
        assertNotNull(page);
        verify(userMapper).findPage(5, 5);
        verifyNoMoreInteractions(userMapper);
    }

    @Test
    @DisplayName("getPageItems: clamp page/size tối thiểu = 1 (page<=0,size<=0)")
    void getPageItems_clamp_min() {
        when(userMapper.findPage(1, 0)).thenReturn(Collections.emptyList());
        List<User> page = userService.getPageItems(0, 0);
        assertNotNull(page);
        // size bị clamp = 1, offset = (1-1)*1 = 0
        verify(userMapper).findPage(1, 0);
        verifyNoMoreInteractions(userMapper);
    }

    // ====== COUNT ======
    @Test
    @DisplayName("countUsers: ủy quyền đúng sang mapper.countAll")
    void countUsers_ok() {
        when(userMapper.countAll()).thenReturn(100L);
        long n = userService.countUsers();
        assertEquals(100L, n);
        verify(userMapper).countAll();
        verifyNoMoreInteractions(userMapper);
    }

    // ====== UPDATE / DELETE (bonus ngắn) ======
    @Test
    @DisplayName("update: trả về số hàng được cập nhật")
    void update_ok() {
        User u = new User();
        u.setId(1L);
        u.setName("Phu");
        when(userMapper.update(u)).thenReturn(1);

        int rows = userService.update(u);

        assertEquals(1, rows);
        verify(userMapper).update(u);
        verifyNoMoreInteractions(userMapper);
    }

    @Test
    @DisplayName("delete: trả về số hàng bị xóa")
    void delete_ok() {
        when(userMapper.delete(1L)).thenReturn(1);
        int rows = userService.delete(1L);
        assertEquals(1, rows);
        verify(userMapper).delete(1L);
        verifyNoMoreInteractions(userMapper);
    }
}
