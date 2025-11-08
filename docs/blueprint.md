# **App Name**: PowerCast

## Core Features:

- Data Import: Import historical electricity demand data along with relevant external variables (temperature, humidity, holidays, etc.).
- Model Training: Train machine learning models (Linear Regression, ARIMA, Random Forest, XGBoost, LightGBM, LSTM, GRU, TCN, CNN+LSTM) on the imported data to predict electricity demand.
- Demand Forecasting: Generate hourly or daily electricity demand forecasts using the trained machine learning models.
- Forecast Visualization: Display the predicted electricity demand forecasts in an interactive chart. Charts can include comparisons with actual data, and display confidence intervals. Display forecast KPIs.
- External Data Tool: An LLM-powered tool to suggest additional sources of relevant data, and to create a report discussing which data has been found to increase forecast accuracy, and suggesting which sources appear promising. Note: data import must be handled separately.

## Style Guidelines:

- Primary color: Deep teal (#008080) for a sense of reliability and technological sophistication.
- Background color: Very light teal (#E0F8F8), subtly desaturated to provide a clean, non-distracting backdrop.
- Accent color: Forest green (#228B22), to signal opportunities for energy savings and sustainable practices.
- Body and headline font: 'Inter', a grotesque-style sans-serif font for a clean and modern look.
- Use a set of consistent and clear icons to represent different data sources and prediction types. Line-based icons are recommended to keep a clean design.
- Use a dashboard layout with clear sections for data import, model selection, forecast visualization, and model comparison.
- Subtle transitions and animations to enhance the user experience, such as loading animations or chart updates.