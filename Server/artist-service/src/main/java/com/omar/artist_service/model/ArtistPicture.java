package com.omar.artist_service.model;


import com.omar.artist_service.shared.AbstractAuditingEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.Arrays;
import java.util.Objects;

@Entity
@Table(name = "artist_pictures")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArtistPicture extends AbstractAuditingEntity<Long> {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "artistPictureSequenceGenerator")
    @SequenceGenerator(name = "artistPictureSequenceGenerator", sequenceName = "artist_picture_seq", allocationSize = 50)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "artist_id", referencedColumnName = "id", nullable = false)
    private Artist artist;

    @Lob
    @Column(name = "file", nullable = false)
    private byte[] file;

    @Column(name = "file_content_type")
    private String fileContentType;

    @Column(name = "is_cover", nullable = false)
    private boolean isCover; // true -> Cover Picture, false -> Profile Picture

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ArtistPicture that = (ArtistPicture) o;
        return isCover == that.isCover && Objects.deepEquals(file, that.file) && Objects.equals(fileContentType, that.fileContentType);
    }

    @Override
    public int hashCode() {
        return Objects.hash(Arrays.hashCode(file), fileContentType, isCover);
    }

    @Override
    public String toString() {
        return "ArtistPicture{" +
                "file=" + Arrays.toString(file) +
                ", fileContentType='" + fileContentType + '\'' +
                ", isCover=" + isCover +
                '}';
    }



}
