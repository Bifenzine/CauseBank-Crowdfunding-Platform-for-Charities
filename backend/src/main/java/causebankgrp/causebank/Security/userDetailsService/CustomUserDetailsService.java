// package causebankgrp.causebank.Security.userDetailsService;

// import java.util.Collections;

// import org.springframework.security.core.authority.SimpleGrantedAuthority;
// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.security.core.userdetails.UserDetailsService;
// import
// org.springframework.security.core.userdetails.UsernameNotFoundException;
// import org.springframework.stereotype.Service;

// import causebankgrp.causebank.Entity.User;
// import causebankgrp.causebank.Repository.UserRepository;
// import lombok.RequiredArgsConstructor;
// import lombok.var;

// @Service
// @RequiredArgsConstructor
// public class CustomUserDetailsService implements UserDetailsService {

// private final UserRepository userRepository;

// @Override
// public UserDetails loadUserByUsername(String email) throws
// UsernameNotFoundException {
// User user = userRepository.findByEmail(email)
// .orElseThrow(() -> new UsernameNotFoundException("User not found"));

// var authorities = Collections.singleton(new
// SimpleGrantedAuthority(user.getRole().name()));

// return new org.springframework.security.core.userdetails.User(
// user.getEmail(),
// user.getPasswordHash(),
// authorities);
// }
// }
