# Ocean artwork

Generated with the built-in imagegen tool using transparent backgrounds. Converted to WebP with `cwebp -m 6`, preserving alpha. Reef quality: 84; fish quality: 86. The octopuses are authored in `src/site/ocean/octopus.tsx` so their arms and fins can animate independently.

| Asset | Dimensions | Placement |
| --- | --- | --- |
| `deep-reef.webp` | 1774 × 887 | Seabed, below footer links |
| `silver-fish.webp` | 384 × 192 | Sunlight and Twilight |
| `reef-fish.webp` | 480 × 320 | Sunlight |
| `lanternfish.webp` | 480 × 240 | Midnight and Abyssal |

## Reef prompt

Use case: stylized-concept. Asset type: transparent decorative panoramic reef for bottom of an underwater website. Generate a lush, cinematic 3D-rendered deep sea coral reef diorama, wide landscape composition, full reef visible. Strongly volumetric forms, intricate shaded branching coral, brain coral, delicate sea fans, hollow tube sponges with dark openings, anemones, kelp, layered rocks and dark sand. Bioluminescent pink, violet, teal, muted orange accents, soft highlights and ambient occlusion. Foreground richly detailed and dimensional, background reef darker blue and hazy. Designed to composite against near-black #01040a water. Reef occupies bottom two thirds; upper edge is an irregular silhouette of coral and kelp against genuinely transparent empty space. Ground fades to very dark at bottom. No fish, no octopuses, no text, no watermark, no rectangular water background. High quality tactile 3D illustration, not flat vector. Entire composition isolated on transparent alpha background.

## Fish prompts

Each fish was generated separately with the following template, substituting its subject below:

Use case: stylized-concept. Asset type: isolated decorative creature for an underwater website. Primary request: {subject} Style: high-end cinematic 3D natural history illustration with beautifully shaded round volumes and realistic materials, ambient occlusion, soft top-left key light and subtle reflected fill, dimensional and tactile. Composition: horizontal landscape, one fish only centered with generous transparent margin, full body visible, swimming left, no seabed or water or bubbles. No text, labels, watermark, cast shadow, or rectangular background. Genuine transparent alpha background. Designed to remain recognizable when displayed 80-180px wide.

### Reef fish subject

A single blue and golden yellow tropical angelfish facing LEFT in side view, complete extended fins and tail, deep cobalt round body with golden stripes and yellow tail, silver blue specular highlights on scales, delicate translucent fin rays, bright glassy eye.

### Silver fish subject

A single sleek silver schooling fish facing LEFT in side view, slender torpedo body, forked tail, iridescent silver and cool blue scales, darker blue back, bright silver belly, translucent fins with fine fin rays and a sharp glossy black eye.

### Lanternfish subject

A single elegant deep sea lanternfish facing LEFT in side view, streamlined dark indigo violet body, luminous turquoise photophores dotted along the lower flank, sapphire and cyan rim lighting, translucent teal fins, a large reflective eye. Intricate scales softly shaded, dark velvet belly with little glowing points. Recognizable fish anatomy, not a cartoon, no lure.

## Tropical surface hero

Generated with the built-in imagegen tool as three independent layers. The sky is opaque; both palms retain generated alpha transparency. Converted with `cwebp -m 6 -q 78`; sky resized to 1440 × 960, palms to 768 × 1152. The sea, surf, birds and sailboat are authored in `src/site/ocean/beach-scene.tsx` for independent motion. The sea begins at 60% of the hero and grades into `#3eaed3`; the bottom mask blends into the live underwater layer.

| Asset | Dimensions | Size | Placement |
| --- | --- | --- | --- |
| `beach-sky.webp` | 1440 × 960 | 32 KB | Drifting sky and cream cumulus clouds |
| `beach-palm-left.webp` | 768 × 1152 | 274 KB | Transparent left palm and bushes |
| `beach-palm-right.webp` | 768 × 1152 | 224 KB | Transparent right palm and bushes |

### Sky prompt

Use case: illustration-story. Asset type: opaque wide sky background layer for a tropical illustrated website hero. Flat painterly vector-style travel illustration, broad simple shapes with very subtle gouache texture, no outlines. Soft light blue cyan sky #a4dfeb, large warm cream-white cumulus clouds clustered along the lower left and lower right edges, scattered smaller cloud wisps, central upper two thirds mostly clear light blue negative space for website text. Clouds rounded sculptural silhouettes with pale aqua shadow shapes, sunny tranquil afternoon. Landscape 1536x1024. SKY AND CLOUDS ONLY, no water, no horizon line, no trees, no foliage, no birds, no land, no text, no border or watermark. Fill the full canvas with opaque sky. Match the spirit of a flat illustrated tropical beach travel poster.

### Left palm prompt

Use case: illustration-story. Asset type: transparent foreground foliage layer for a tropical website hero. Flat painterly vector-style travel illustration, broad cut-paper shapes with very subtle gouache texture, clean silhouettes, no outlines, no photorealism or 3D. Dark forest teal and olive green palm fronds with lime sunlit facets; gently curved warm brown trunk with muted salmon bark highlights. Lush tropical philodendron, fern and banana bushes clustered at the base. Portrait 1024x1536 composition. One tall coconut palm, full foliage and trunk with small transparent margin. Genuine transparent alpha background through all gaps between leaves. No sky, no sea, no sand, no ground, no shadow outside the plants, no text, no border, no watermark. LEFT framing layer: trunk rooted in the lower LEFT corner, leaning right toward the upper centre, long graceful fronds drape to the right. Bushes concentrated on the LEFT and bottom, right lower half empty transparent space.

### Right palm prompt

Use case: illustration-story. Asset type: transparent foreground foliage layer for a tropical website hero. Flat painterly vector-style travel illustration, broad cut-paper shapes with very subtle gouache texture, clean silhouettes, no outlines, no photorealism or 3D. Dark forest teal and olive green palm fronds with lime sunlit facets; gently curved warm brown trunk with muted salmon bark highlights. Lush tropical philodendron, fern and banana bushes clustered at the base. Portrait 1024x1536 composition. One tall coconut palm, full foliage and trunk with small transparent margin. Genuine transparent alpha background through all gaps between leaves. No sky, no sea, no sand, no ground, no shadow outside the plants, no text, no border, no watermark. RIGHT framing layer: trunk rooted in the lower RIGHT corner, leaning left toward the upper centre, long graceful fronds drape to the left. Bushes concentrated on the RIGHT and bottom, left lower half empty transparent space. Slightly asymmetrical crown, smaller secondary palm peeking above bushes.
