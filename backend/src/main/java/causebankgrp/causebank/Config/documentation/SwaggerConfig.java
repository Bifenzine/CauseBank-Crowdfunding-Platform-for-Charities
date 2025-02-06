package causebankgrp.causebank.Config.documentation;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

// no secured version


@Configuration
@OpenAPIDefinition
@SecurityScheme(
    name = "JWT",
    type = SecuritySchemeType.HTTP,
    bearerFormat = "JWT",
    scheme = "bearer",
    in = SecuritySchemeIn.HEADER
)
public class SwaggerConfig {
    
    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .addSecurityItem(new SecurityRequirement().addList("JWT"))
                .info(new Info()
                        .title("CauseBank API Documentation")
                        .description("REST API documentation for CauseBank platform")
                        .version("1.0")
                        .contact(new Contact()
                                .name("CauseBank Team")
                                .email("causebankgov@gmail.com")));
    }
}


// secured version
// @Configuration
// public class SwaggerConfig {
    
//     @Bean
//     public OpenAPI openAPI() {
//         return new OpenAPI()
//                 .info(new Info()
//                         .title("CauseBank API Documentation")
//                         .description("REST API documentation for CauseBank platform")
//                         .version("1.0")
//                         .contact(new Contact()
//                                 .name("CauseBank Team")
//                                 .email("support@causebank.com")))
//                 .addSecurityItem(new SecurityRequirement().addList("JWT"))
//                 .components(new io.swagger.v3.oas.models.Components()
//                         .addSecuritySchemes("JWT", 
//                             new SecurityScheme()
//                                 .type(SecurityScheme.Type.HTTP)
//                                 .scheme("bearer")
//                                 .bearerFormat("JWT")));
//     }
// }