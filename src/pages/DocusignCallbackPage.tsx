import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DocusignCallbackPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Simple success handler - in a real app you might exchange code for token here or via backend
        const timer = setTimeout(() => {
            if (window.opener) {
                window.close();
            } else {
                navigate('/dashboard');
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="p-8 bg-white rounded-lg shadow-md text-center border border-gray-100 max-w-md w-full">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Authorization Successful</h2>
                <p className="text-gray-600 mb-6">
                    You have successfully connected DocuSign. This window will close automatically.
                </p>
                <div className="text-xs text-gray-400">
                    Redirecting...
                </div>
            </div>
        </div>
    );
};

export default DocusignCallbackPage;
