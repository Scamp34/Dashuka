#!/bin/bash

# Function to create a simple colored SVG placeholder
create_placeholder() {
  local path="$1"
  local text="$2"
  local color="$3"
  
  cat > "$path" << SVGEOF
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="${color}"/>
  <text x="400" y="300" font-family="Arial, sans-serif" font-size="36" fill="white" text-anchor="middle" dominant-baseline="middle">${text}</text>
</svg>
SVGEOF
}

# Husky Portrait (3 photos)
create_placeholder "husky-portrait/cover.jpg" "Husky Portrait - Cover" "#4A90A4"
create_placeholder "husky-portrait/001.jpg" "Husky Photo 1" "#5BA5B8"
create_placeholder "husky-portrait/002.jpg" "Husky Photo 2" "#6BB9CC"
create_placeholder "husky-portrait/003.jpg" "Husky Photo 3" "#7CCDE0"

# Golden Retriever (4 photos)
create_placeholder "golden-retriever/cover.jpg" "Golden Retriever - Cover" "#D4A574"
create_placeholder "golden-retriever/001.jpg" "Golden Photo 1" "#E0B884"
create_placeholder "golden-retriever/002.jpg" "Golden Photo 2" "#ECC994"
create_placeholder "golden-retriever/003.jpg" "Golden Photo 3" "#F8D9A4"
create_placeholder "golden-retriever/004.jpg" "Golden Photo 4" "#FFE8B4"

# Family Portrait (3 photos)
create_placeholder "family-portrait/cover.jpg" "Family Portrait - Cover" "#9B7E9E"
create_placeholder "family-portrait/001.jpg" "Family Photo 1" "#AC8FAF"
create_placeholder "family-portrait/002.jpg" "Family Photo 2" "#BDA0C0"
create_placeholder "family-portrait/003.jpg" "Family Photo 3" "#CEB1D1"

# Friends Park (4 photos)
create_placeholder "friends-park/cover.jpg" "Friends in Park - Cover" "#7EC87E"
create_placeholder "friends-park/001.jpg" "Friends Photo 1" "#8FD88F"
create_placeholder "friends-park/002.jpg" "Friends Photo 2" "#A0E8A0"
create_placeholder "friends-park/003.jpg" "Friends Photo 3" "#B1F8B1"
create_placeholder "friends-park/004.jpg" "Friends Photo 4" "#C2FFC2"

# Mountain Lake (5 photos)
create_placeholder "mountain-lake/cover.jpg" "Mountain Lake - Cover" "#5D8AA8"
create_placeholder "mountain-lake/001.jpg" "Mountain Photo 1" "#6E9AB8"
create_placeholder "mountain-lake/002.jpg" "Mountain Photo 2" "#7FAAC8"
create_placeholder "mountain-lake/003.jpg" "Mountain Photo 3" "#90BAD8"
create_placeholder "mountain-lake/004.jpg" "Mountain Photo 4" "#A1CAE8"
create_placeholder "mountain-lake/005.jpg" "Mountain Photo 5" "#B2D8F8"

# Sunset Beach (4 photos)
create_placeholder "sunset-beach/cover.jpg" "Sunset Beach - Cover" "#E8998D"
create_placeholder "sunset-beach/001.jpg" "Sunset Photo 1" "#F2A99D"
create_placeholder "sunset-beach/002.jpg" "Sunset Photo 2" "#FCB9AD"
create_placeholder "sunset-beach/003.jpg" "Sunset Photo 3" "#FFC9BD"
create_placeholder "sunset-beach/004.jpg" "Sunset Photo 4" "#FFD9CD"

echo "All placeholders created successfully!"
