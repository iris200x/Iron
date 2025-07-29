import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

const genderOptions = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
const healthStatusOptions = ['Excellent', 'Good', 'Fair', 'Poor', 'Prefer not to say'];
const fitnessGoalsOptions = ['Build Muscle', 'Lose Weight', 'Improve Endurance', 'Increase Flexibility', 'General Fitness'];

export function RegisterStepTwo({ formData, handleInputChange, handlePreviousStep }: { formData: any, handleInputChange: any, handlePreviousStep: any }) {
    return (
        <>
            <h2 className="mb-4 text-2xl font-bold text-gray-800">Tell us about yourself!</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                    <label htmlFor="firstName" className="mb-2 block text-sm font-medium text-gray-700">First Name</label>
                    <Input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required placeholder="John" />
                </div>
                <div>
                    <label htmlFor="lastName" className="mb-2 block text-sm font-medium text-gray-700">Last Name</label>
                    <Input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required placeholder="Doe" />
                </div>
                <div>
                    <label htmlFor="age" className="mb-2 block text-sm font-medium text-gray-700">Age</label>
                    <Input type="number" id="age" name="age" min="1" max="120" value={formData.age} onChange={handleInputChange} required placeholder="e.g., 30" />
                </div>
                <div>
                    <label htmlFor="gender" className="mb-2 block text-sm font-medium text-gray-700">Gender</label>
                    <Select id="gender" name="gender" value={formData.gender} onChange={handleInputChange} required>
                        <option value="">Select gender</option>
                        {genderOptions.map((option) => (<option key={option} value={option}>{option}</option>))}
                    </Select>
                </div>
                <div>
                    <label htmlFor="healthStatus" className="mb-2 block text-sm font-medium text-gray-700">Health Status</label>
                    <Select id="healthStatus" name="healthStatus" value={formData.healthStatus} onChange={handleInputChange} required>
                        <option value="">Select health status</option>
                        {healthStatusOptions.map((option) => (<option key={option} value={option}>{option}</option>))}
                    </Select>
                </div>
                <div>
                    <label htmlFor="goals" className="mb-2 block text-sm font-medium text-gray-700">Fitness Goals</label>
                    <Select id="goals" name="goals" value={formData.goals} onChange={handleInputChange} required>
                        <option value="">Select primary goal</option>
                        {fitnessGoalsOptions.map((option) => (<option key={option} value={option}>{option}</option>))}
                    </Select>
                </div>
            </div>
            <div className="mt-6 flex justify-between">
                <Button type="button" variant="ghost" onClick={handlePreviousStep} icon="back">
                    Previous
                </Button>
                <Button type="submit" variant="form" size="md">
                    Create Account
                </Button>
            </div>
        </>
    );
}