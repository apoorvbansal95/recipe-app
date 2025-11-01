import React from 'react'
import { Box, Typography, Stack, TextField, Select, MenuItem, Button } from '@mui/material';
import { Ingredient, RecipeStep } from '../features/recipes/types';
import { nanoid } from 'nanoid';
interface Props{
    steps:RecipeStep[]
    setSteps:(v:RecipeStep[])=>void
    ingredients:Ingredient[]
}
export default function StepEditor({steps, setSteps, ingredients}:Props) {
    const updatedStep=(id: string, field: keyof RecipeStep, value: any)=>{
        setSteps(steps.map((step)=>(
            step.id===id?{...step, [field]:value}:step)))
    }

    const handleAdd=()=>{
        setSteps([...steps, {id:nanoid(), description:" ", type:"instruction", durationMinutes:1}])
    }

    const handleRemove=(id:string)=>{
        setSteps(steps.filter((step)=>step.id!==id))
    }

  return (
    <Box>
        <Typography variant='h6'>Steps</Typography>
        <Stack>
            {steps.map((step)=>(
                <Box key={step.id}>
                <Stack>
                    <TextField label="Description"
                    value={step.description}
                    onChange={(e)=>updatedStep(step.id, 'description', e.target.value)}/>
                <Stack>
                <Typography>Type:</Typography>
                <Select value={step.type} onChange={(e)=>updatedStep(step.id, 'type', e.target.value)}>
                <MenuItem value="instruction">Instruction</MenuItem>
                <MenuItem value="cooking">Cooking</MenuItem>
                </Select>
                <TextField
                  label="Duration (min)"
                  type="number"
                  sx={{ width: 150 }}
                  value={step.durationMinutes}
                  onChange={(e) => updatedStep(step.id, 'durationMinutes', Number(e.target.value))}
                />
                </Stack>
                {step.type==='cooking'&& (
                     <Stack direction="row" spacing={2}>
                  <TextField
                    label="Temperature (°C)"
                    type="number"
                    value={step.cookingSettings?.temperature ?? ''}
                    onChange={(e) =>
                      updatedStep(step.id, 'cookingSettings', {
                        ...step.cookingSettings,
                        temperature: Number(e.target.value),
                        speed: step.cookingSettings?.speed ?? 1,
                      })
                    }
                  />
                  <TextField
                    label="Speed"
                    type="number"
                    value={step.cookingSettings?.speed ?? ''}
                    onChange={(e) =>
                      updatedStep(step.id, 'cookingSettings', {
                        ...step.cookingSettings,
                        speed: Number(e.target.value),
                        temperature: step.cookingSettings?.temperature ?? 100,
                      })
                    }
                  />
                </Stack>
                )}


                {step.type==='instruction' && (
                    <TextField
                  label="Ingredient IDs (comma separated)"
                  value={step.ingredientIds?.join(', ') ?? ''}
                  onChange={(e) =>
                    updatedStep(step.id, 'ingredientIds', e.target.value.split(',').map((v) => v.trim()))
                  }
                />
                )}

                <Button onClick={()=>handleRemove(step.id)}>
                    Delete
                </Button>
                

                </Stack>
    
                </Box>
                
            ))}
            <Button onClick={handleAdd}>Add + Step</Button>
        </Stack>
      
    </Box>
  )
}
