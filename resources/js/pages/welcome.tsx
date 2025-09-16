// import AppLayout from '@/layouts/app-layout';
import { PublicLayout } from '@/layouts/frontend/public-layout';
import MCQHomepage from './Homepage/Homepage';

export default function Welcome() {
    // const { auth } = usePage<SharedData>().props;

    return (
        <PublicLayout title="Hompage">
            <MCQHomepage />
            {/* <div>Homepage</div> */}
        </PublicLayout>
    );
}
