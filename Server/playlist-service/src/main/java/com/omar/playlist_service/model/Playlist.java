package com.omar.playlist_service.model;

import com.omar.playlist_service.shared.AbstractAuditingEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "playlist")
public class Playlist extends AbstractAuditingEntity<Long> {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "playlistSequenceGenerator")
    @SequenceGenerator(name = "playlistSequenceGenerator", sequenceName = "playlist_seq", allocationSize = 1)
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", nullable = true)
    private String description;

    @Lob
    @Column(name = "cover", nullable = true)
    private byte[] cover;

    @Column(name = "cover_content_type", nullable = true)
    private String coverContentType;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @ElementCollection
    @CollectionTable(name = "playlist_song", joinColumns = @JoinColumn(name = "playlist_id"))
    @Column(name = "song_id")
    private Set<Long> songIds = new HashSet<>(); // List of song IDs

}
