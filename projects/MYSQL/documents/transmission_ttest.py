import pandas as pd
from scipy.stats import ttest_ind

# Load your CSV
df = pd.read_csv(r"C:\Users\dansc\OneDrive\Desktop\Portfolio\projects\MYSQL\transmission_vs_price.csv")

# Assuming your columns are 'transmission_type' and 'msrp'
manual = df[df['transmission_type'] == 'MANUAL']['avg_msrp']
auto = df[df['transmission_type'] == 'AUTOMATIC']['avg_msrp']

# Run t-test
t_stat, p_value = ttest_ind(manual, auto, equal_var=False)
print(f"T-statistic: {t_stat:.3f}, P-value: {p_value:.5f}")

