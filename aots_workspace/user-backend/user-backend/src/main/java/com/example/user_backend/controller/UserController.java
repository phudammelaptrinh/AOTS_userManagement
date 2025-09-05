package com.example.user_backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.user_backend.model.User;
import com.example.user_backend.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
@Transactional
public class UserController {

	private final UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}

	@GetMapping("/get-all")
	public List<User> getAll() {
		return userService.getAllUsers();
	}

	@PostMapping("/create")
	public ResponseEntity<?> create(@Valid @RequestBody List<User> users) {
		int total = 0;
		for (User u : users) {
			total += userService.create(u);
		}
		return ResponseEntity.ok(Map.of("inserted", total, "message", "Bulk insert successful"));
	}

	@PutMapping("/{id}")
	public ResponseEntity<Boolean> updatePut(@PathVariable("id") Long id, @RequestBody User user) {
		if (id == null)
			return ResponseEntity.badRequest().body(false);
		user.setId(id);
		int rows = userService.update(user);
		return rows > 0 ? ResponseEntity.ok(true) : ResponseEntity.status(HttpStatus.NOT_FOUND).body(false);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Boolean> deleteDel(@PathVariable("id") Long id) {
		if (id == null)
			return ResponseEntity.badRequest().body(false);
		int rows = userService.delete(id);
		return rows > 0 ? ResponseEntity.ok(true) : ResponseEntity.status(HttpStatus.NOT_FOUND).body(false);
	}

	@PostMapping("/update")
	@Deprecated
	public ResponseEntity<Boolean> update(@RequestBody User user) {
		if (user.getId() == null) {
			return ResponseEntity.badRequest().body(false);
		}
		int rows = userService.update(user);
		return rows > 0 ? ResponseEntity.ok(true) : ResponseEntity.status(HttpStatus.NOT_FOUND).body(false);
	}

	@PostMapping("/delete")
	@Deprecated
	public ResponseEntity<Boolean> delete(@RequestBody(required = false) User user,
			@RequestParam(name = "id", required = false) Long idQP) {

		Long id = (user != null ? user.getId() : null);
		if (id == null)
			id = idQP;

		if (id == null) {
			return ResponseEntity.badRequest().body(false); // 400 thiếu id
		}
		int rows = userService.delete(id);
		return rows > 0 ? ResponseEntity.ok(true) : ResponseEntity.status(HttpStatus.NOT_FOUND).body(false);
	}

	// Navigator
	@GetMapping("/get-page")
	public ResponseEntity<List<User>> getPage(@RequestParam(name = "page", defaultValue = "1") int page,
			@RequestParam(name = "size", defaultValue = "5") int size) {

		List<User> items = userService.getPageItems(page, size);
		long total = userService.countUsers();
		long totalPages = (long) Math.ceil((double) total / size);

		HttpHeaders h = new HttpHeaders();
		h.add("X-Total-Count", String.valueOf(total));
		h.add("X-Total-Pages", String.valueOf(totalPages));
		h.add("X-Page", String.valueOf(page));
		h.add("X-Size", String.valueOf(size));
		return new ResponseEntity<>(items, h, HttpStatus.OK);
	}
}
