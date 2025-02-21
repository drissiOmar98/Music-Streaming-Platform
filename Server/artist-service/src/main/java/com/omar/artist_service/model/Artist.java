package com.omar.artist_service.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "artists")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Artist {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "artistSequenceGenerator")
    @SequenceGenerator(name = "artistSequenceGenerator", sequenceName = "artist_seq", allocationSize = 1)
    private Long id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "bio")
    private String bio;


    @OneToMany(mappedBy = "artist", cascade = CascadeType.REMOVE)
    private Set<ArtistPicture> pictures = new HashSet<>();
}
