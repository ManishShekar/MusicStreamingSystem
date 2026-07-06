import {
  Card,
  CardActionArea,
  CardMedia,
  Typography,
  Box,
} from "@mui/material";
import AlbumIcon from "@mui/icons-material/Album";
import { useNavigate } from "react-router-dom";
import type { Album } from "@/types";
import { resolveImageUrl } from "@/utils/constants";

interface AlbumCardProps {
  album: Album;
}

const AlbumCard = ({ album }: AlbumCardProps) => {
  const navigate = useNavigate();
  const cover = resolveImageUrl(album.coverImageUrl);

  return (
    <Card elevation={0} sx={{ borderRadius: 2 }}>
      <CardActionArea
        onClick={() => navigate(`/albums/${album.albumId}`)}
        sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}
      >
        {cover ? (
          <CardMedia
            component="img"
            image={cover}
            alt={album.title}
            sx={{ width: "100%", aspectRatio: "1 / 1", borderRadius: 1.5 }}
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              aspectRatio: "1 / 1",
              borderRadius: 1.5,
              bgcolor: "grey.900",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AlbumIcon sx={{ fontSize: 48, color: "grey.600" }} />
          </Box>
        )}
        <Typography
          variant="subtitle1"
          fontWeight={700}
          noWrap
          sx={{ width: "100%" }}
        >
          {album.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          noWrap
          sx={{ width: "100%" }}
        >
          {album.releaseYear} • {album.artistName}
        </Typography>
      </CardActionArea>
    </Card>
  );
};

export default AlbumCard;
