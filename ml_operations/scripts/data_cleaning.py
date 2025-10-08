'''
this script formats the data into a fromat viable for a ml model 
problem:
    - data is organized as a m,n matrix where m is the disease of the case and n is the associated symptoms 
goal:
    - organize the data into a 2D matrix where m is the given case and n is a binary representation of the associated symptoms 

''' 
import pandas as pd

# import data 
RawSymptomsFrame = pd.read_csv('/Users/jroyarekhua/SymptomCheckerHackthon/ml_operations/data/raw/dataset.csv',
                               header=None,
                               on_bad_lines='skip',
                               skip_blank_lines=True)

CleanSymptoms = RawSymptomsFrame.copy()

# clean string data 
for col in CleanSymptoms.select_dtypes(include='object').columns:
    CleanSymptoms[col] = ( CleanSymptoms[col]
                          .str.strip()
                          .str.lower()
                          .str.replace('_ ', '_')
                          .str.replace(' _','_')
                          .str.replace(' ', '_')) 
# add a case_id to track cases 

CleanSymptoms.columns = CleanSymptoms.iloc[0]
temp = [col for col in CleanSymptoms.columns if col != "disease"]
CleanSymptoms.drop(index=0,inplace=True) # drop unneeded column 
CleanSymptoms['case_id'] = range(len(CleanSymptoms))
predictions = CleanSymptoms[['case_id','disease']].drop_duplicates().copy()
print(predictions)
# # flatten data, making each patient associated with a disease - columns are 
CleanSymptoms = CleanSymptoms.melt(
    id_vars=['case_id'],
    value_vars=temp,
    value_name='symptom_name',
    var_name='symptom'
)

CleanSymptoms.dropna(inplace=True)

# create present values to fill the new frame
CleanSymptoms['present'] = 1 

# pivot tables ( columns - symptom name)
CleanSymptoms = CleanSymptoms.pivot_table(
    index='case_id',
    columns=['symptom_name'],
    aggfunc='max',
    values='present',
    fill_value=0
)
# print rows and cols to verify accuracy



# merge with case_id dataframe
encoding = pd.merge(CleanSymptoms,predictions,on='case_id')
print(encoding.shape)
print(encoding.stack().nunique())
print(encoding.columns)
print(encoding)

# export clean symptoms 
encoding.to_csv('/Users/jroyarekhua/SymptomCheckerHackthon/ml_operations/data/clean/enocded_symptoms.csv')
print('successfully exported')