import pandas as pd

def generate_wireframe(df: pd.DataFrame):
    connections = []

    # Group by Zone and Block to form logical pipe links
    for (zone, block), group in df.groupby(["Zone", "Block"]):

        # Sort to keep deterministic order
        group = group.sort_values("Pipe")

        points = group[["Latitude", "Longitude", "Location_Code"]].values

        for i in range(len(points) - 1):
            connections.append({
                # 🔑 this is what frontend will use to identify the pipe
                "location_code": points[i][2],

                "from": points[i][2],
                "to": points[i + 1][2],

                "coords": [
                    [points[i][0], points[i][1]],
                    [points[i + 1][0], points[i + 1][1]]
                ],

                # optional: default color for initial clusters
                "color": "#6c757d"
            })

    return connections
