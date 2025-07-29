import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function RegisterStepOne({ formData, handleInputChange }: { formData: any, handleInputChange: any }) {
    return (
        <>
            <div>
                <label htmlFor="username" className="mb-2 block text-sm font-medium text-gray-700">Username</label>
                <Input type="text" id="username" name="username" value={formData.username} onChange={handleInputChange} required placeholder="e.g., Iris" />
            </div>
            <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">Email Address</label>
                <Input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="you@example.com" />
            </div>
            <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">Password</label>
                <Input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} required placeholder="••••••••" />
            </div>
            <div>
                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-gray-700">Confirm Password</label>
                <Input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required placeholder="••••••••" />
            </div>
            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Register as</label>
                <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                        <input type="radio" name="role" value="user" checked={formData.role === 'user'} onChange={handleInputChange} className="h-4 w-4 text-yellow-600 border-gray-300 focus:ring-yellow-500" />
                        <span className="ml-2 text-sm text-gray-700">User</span>
                    </label>
                    <label className="flex items-center">
                        <input type="radio" name="role" value="instructor" checked={formData.role === 'instructor'} onChange={handleInputChange} className="h-4 w-4 text-yellow-600 border-gray-300 focus:ring-yellow-500" />
                        <span className="ml-2 text-sm text-gray-700">Instructor</span>
                    </label>
                </div>
            </div>
            <div className="pt-6">
                <Button type="submit" variant="form" size="md">
                    Next: Profile Details
                </Button>
            </div>
        </>
    );
}