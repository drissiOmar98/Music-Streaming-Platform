package com.omar.artist_service.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class DisplayArtistDTO {
    private Long id;
    private String name;
    private String bio;
    private List<PictureDTO> pictures ;

}
