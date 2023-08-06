import Logo from "../common/Logo/Logo"

export default function Footer() {

    return (
        <section className='Footer'>
            <div className='content'>
                <span className='column'>
                    <Logo />
                </span>

                <span className='column'>
                    <div className='title'>About the Application</div>
                    <p>Coconut is a table management application, designed for fictional venues and roleplaying events.</p>
                    <p>Coconut is part of the Kiwi: Venue Management Suite.</p>
                </span>

                <span className='column'>
                    <div className='title'>Development & Hosting</div>
                    <p>Designed, developed, and hosted by Enhasa.</p>
                </span>

                <span className='column'>
                    <div className='title'>Disclaimer</div>
                    <p>All venue names, customer names, and menu items presented in this application are purely fictional.</p>
                    <p>Any resemblance to actual venues, customers, or menu items is purely coincidental and not intentional.</p>
                </span>

                <span className='column'>
                    <div className='title'>Copyright</div>
                    <p>© 2023 Enhasa. All rights reserved.</p>
                </span>
            </div>
        </section>
    )
}