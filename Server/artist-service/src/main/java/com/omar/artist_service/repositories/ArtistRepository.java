package com.omar.artist_service.repositories;


import com.omar.artist_service.model.Artist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;


@Repository
public interface ArtistRepository extends JpaRepository<Artist, Long> {

    @Query("SELECT product" +
            " from Artist product " +
            "LEFT JOIN FETCH product.pictures picture" +
            " WHERE picture.isCover = true ")
    Page<Artist> findAllWithCoverOnly(Pageable pageable);

    @Query("SELECT a " +
            "FROM Artist a " +
            "LEFT JOIN FETCH a.pictures pictures " +
            "WHERE a.id = :id AND pictures.isCover = true")
    Optional<Artist> findArtistWithCoverOnly(@Param("id") Long id);


}
