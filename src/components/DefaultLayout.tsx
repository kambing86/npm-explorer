const Header: React.FC = () => null;

const Body: React.FC = () => null;

const Footer: React.FC = () => null;

type Node = React.ReactElement<{ children: React.ReactNode }>;

const DefaultLayout = ({ children }: { children: Node | Node[] }) => {
  const childrenArray = Array.isArray(children) ? children : [children];
  const header = childrenArray.find((el) => el.type === Header);
  const body = childrenArray.find((el) => el.type === Body);
  const footer = childrenArray.find((el) => el.type === Footer);

  return (
    <div className="container">
      <header>{header ? header.props.children : null}</header>
      <main>{body ? body.props.children : null}</main>
      <footer>{footer ? footer.props.children : null}</footer>
    </div>
  );
};

DefaultLayout.Header = Header;
DefaultLayout.Body = Body;
DefaultLayout.Footer = Footer;

export default DefaultLayout;
