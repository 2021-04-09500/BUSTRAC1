package com.schoolbus.schoolbusapp.Security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {

    private static final String SECRET_KEY = "d16e47b8b2c75cae9bae4abbb3f169529a96757533c6cba63fe20c2238a87db2b95ca7fc198756030f7b8b7307f5884f03c653e8baa304ddf2ab2d5f5157bc72ad1f174751dadfbd1d4a83a048e32dac3616dbf843c51189a1dbbebc57fdc3491c4c387ff3359459ad367925204d3519b40fbc622dfb297d1666e74c7fe3305949a0a22ba2e5c2410cf6ba073a18d7fe571fe39fcfb2a38037d03bb4e57785ad2ead8796fed4680ae85d9301e9d0680100c1d8314161746b8f82daaa3937270e73419c642c2752a117a7a2bf3662e59061019836b8eaab5ce9206f8c7008ce4a9e6dc8ce726ba9070a8b15b8501f8340b48514586a8d4cfba683760e9923c937";

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claimsResolver.apply(claims);
    }

    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Key getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }
}


