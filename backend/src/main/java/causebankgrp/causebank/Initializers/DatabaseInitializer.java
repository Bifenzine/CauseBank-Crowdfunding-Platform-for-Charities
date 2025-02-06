// package causebankgrp.causebank.Initializers;

// import causebankgrp.causebank.Security.SecurityConfig;
// import lombok.RequiredArgsConstructor;
// import lombok.extern.slf4j.Slf4j;
// import org.springframework.boot.CommandLineRunner;
// import org.springframework.stereotype.Component;

// import java.util.Arrays;
// import java.util.List;
// import java.util.stream.Collectors;

// @Slf4j
// @RequiredArgsConstructor
// @Component
// public class DatabaseInitializer implements CommandLineRunner {

//     // private final UserService userService;
//     // private final BookService bookService;

//     // @Override
//     // public void run(String... args) {
//     //     if (!userService.getUsers().isEmpty()) {
//     //         return;
//     //     }
//     //     USERS.forEach(userService::saveUser);
//     //     getBooks().forEach(bookService::saveBook);
//     //     log.info("Database initialized");
//     // }

//     // private List<Book> getBooks() {
//     //     return Arrays.stream(BOOKS_STR.split("\n"))
//     //             .map(bookInfoStr -> bookInfoStr.split(";"))
//     //             .map(bookInfoArr -> new Book(bookInfoArr[0], bookInfoArr[1]))
//     //             .collect(Collectors.toList());
//     // }

//     // private static final List<User> USERS = Arrays.asList(
//     //         new User("admin", "admin", "Admin", "admin@mycompany.com", SecurityConfig.ADMIN),
//     //         new User("user", "user", "User", "user@mycompany.com", WebSecurityConfig.USER)
//     // );

//     private static final String CATEGO_STR =
//             """
//                     9781603090773;Any Empire
//                     9781603090698;August Moon
//                     9781891830372;The Barefoot Serpent (softcover) by Scott Morse
//                     """;
// }
