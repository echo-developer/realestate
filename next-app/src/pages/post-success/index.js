import MainLayout from "@/components/layout/MainLayout";
import Link from "next/link";

const Index = () => {
    return (
        <MainLayout>
            <section className="section post-page">
                <div className="container">
                    <div className="row justify-content-center">
                        <aside className="col-lg-8 col-12">
                            <div className="card border-0 post-form">
                                <div className="card-body">
                                    <div className="post-success" id="step-7">
                                        <div>
                                            <img
                                                src="assets/images/icons/post-success.png"
                                                alt="post-success"
                                                height="128"
                                                width="128"
                                                className="mb-3"
                                            />
                                            <h1 className="h3 text-success">
                                                Congratulations! Successfully
                                                Post Your Property
                                            </h1>
                                            <p>
                                                Your ads will show in our top
                                                list. Lorem ipsum dolor sit amet
                                                consectetur adipiscing elit sed
                                                do eiusmod tempor incididunt ut
                                                labore et dolore magna aliqua.
                                                Utenim ad minim veniam, quis
                                                nostrud exercitation ullamco
                                                laboris nisi ut aliquip ex ea
                                                commodo consequat.
                                            </p>
                                            <Link
                                                href="/postproperty"
                                                className="btn btn-primary"
                                            >
                                                <i className="icon-line-awesome-mouse-pointer"></i>{" "}
                                                Post More Property
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
};

export default Index;
