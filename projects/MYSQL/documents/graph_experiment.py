import pandas as pd
import numpy as np
import plotly.graph_objects as go
from scipy.stats import gaussian_kde

# Load data
df = pd.read_csv(r"C:\Users\dansc\OneDrive\Desktop\Portfolio\projects\MYSQL\documents\vehicle_pricing_analysis.csv")

# Filter out Large Convertibles
df = df[~((df['vehicle_style'] == 'Convertible') & (df['vehicle_size'] == 'Large'))].copy()

# Drop NaNs (if any)
df = df.dropna(subset=['avg_pop'])

# Create style/size label
df['label'] = df['vehicle_style'] + " / " + df['vehicle_size']

# Bin setup
num_bins = 40
bin_edges = np.linspace(df['avg_pop'].min(), df['avg_pop'].max(), num_bins + 1)
bin_width = bin_edges[1] - bin_edges[0]

# Assign bins and midpoints
df['bin'] = pd.cut(df['avg_pop'], bins=bin_edges, include_lowest=True)
df['bin_mid'] = df['bin'].apply(lambda x: (x.left + x.right) / 2)

# Group into bins
bar_df = df.groupby('bin_mid', dropna=True).agg({
    'label': lambda x: '<br>'.join(x),
    'avg_pop': 'count'
}).reset_index().rename(columns={'avg_pop': 'count'})

# KDE for bell curve
popularity = df['avg_pop'].values
kde = gaussian_kde(popularity, bw_method=0.3)
x_vals = np.linspace(popularity.min(), popularity.max(), 500)
kde_vals = kde(x_vals) * len(popularity) * bin_width  # scale for comparison

# Bar chart trace
bar_trace = go.Bar(
    x=bar_df['bin_mid'],
    y=bar_df['count'],
    text=bar_df['label'],
    textposition='none',  # <-- hides the text inside bars
    hovertemplate='<b>Combos in Bin:</b><br>%{text}<br><br>Count: %{y}<extra></extra>',
    marker_color='#59085a',
    name='Style/Size Combos',
    opacity=0.4
)

# KDE bell curve
kde_trace = go.Scatter(
    x=x_vals,
    y=kde_vals,
    mode='lines',
    line=dict(color='black', dash='dash'),
    name='KDE (Bell Curve)'
)
# Add percentile lines and staggered labels
percentiles = np.percentile(popularity, np.arange(10, 100, 10))
percentile_lines = []
percentile_labels = []

base_y = max(kde_vals) * 1.35
offset = max(kde_vals) * 0.05  # 5% of max height

for i, val in enumerate(percentiles, start=1):
    # Vertical line
    percentile_lines.append(
        go.Scatter(
            x=[val, val],
            y=[0, base_y],
            mode='lines',
            line=dict(color='gray', dash='dot'),
            showlegend=False,
            hoverinfo='skip'
        )
    )
    # Offset label height alternately above/below
    staggered_y = base_y + ((-1) ** i) * offset
    percentile_labels.append(
        go.Scatter(
            x=[val],
            y=[staggered_y],
            mode='text',
            text=[f"{i*10}%"],
            textposition="top right",
            textfont=dict(color='gray'),
            showlegend=False,
            hoverinfo='skip'
        )
    )
# Combine and layout
fig = go.Figure(data=[bar_trace, kde_trace] + percentile_lines + percentile_labels)

fig.update_layout(
    xaxis_title="Average Popularity (Brand-Level)",
    yaxis_title="Number of Combos",
    template="simple_white",
    barmode="overlay",
    height=500
)

fig.show()

fig.write_html("popularity_distribution.html")