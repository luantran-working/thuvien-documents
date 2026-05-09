const sidebars = {
    tutorialSidebar: [
        "intro",
        {
            type: "category",
            label: "Tổng quan",
            collapsed: false,
            items: [
                "tong-quan/tam-nhin-va-pham-vi",
                "tong-quan/nguoi-dung-va-vai-tro",
                "tong-quan/quy-dinh-nghiep-vu",
            ],
        },
        {
            type: "category",
            label: "Kiến trúc hệ thống",
            collapsed: false,
            items: [
                "kien-truc/tong-quan-kien-truc",
                "kien-truc/cong-nghe",
                "kien-truc/database-design",
                "kien-truc/bao-mat",
            ],
        },
        {
            type: "category",
            label: "Chức năng",
            collapsed: false,
            items: [
                "chuc-nang/quan-ly-sach",
                "chuc-nang/quan-ly-nguoi-dung",
                "chuc-nang/muon-tra-sach",
                "chuc-nang/dat-truoc",
                "chuc-nang/quan-ly-phat",
                "chuc-nang/tim-kiem",
                "chuc-nang/bao-cao",
                "chuc-nang/thong-bao",
                "chuc-nang/sao-luu",
            ],
        },
        {
            type: "category",
            label: "Giao diện",
            collapsed: false,
            items: [
                "giao-dien/thiet-ke-ui-ux",
                "giao-dien/man-hinh-chinh",
                "giao-dien/man-hinh-theo-vai-tro",
                "giao-dien/so-do-thu-vien",
            ],
        },
        {
            type: "category",
            label: "Thiết bị",
            collapsed: false,
            items: [
                "thiet-bi/ma-vach",
                "thiet-bi/in-an",
                "thiet-bi/the-hoc-sinh",
            ],
        },
        {
            type: "category",
            label: "Hướng dẫn phát triển",
            collapsed: false,
            items: [
                "huong-dan-phat-trien/cai-dat-moi-truong",
                "huong-dan-phat-trien/cau-truc-du-an",
                "huong-dan-phat-trien/quy-tac-code",
                "huong-dan-phat-trien/testing",
            ],
        },
        {
            type: "category",
            label: "Triển khai",
            collapsed: false,
            items: [
                "trien-khai/build-va-package",
                "trien-khai/cai-dat-lan-dau",
                "trien-khai/nang-cap",
            ],
        },
        {
            type: "category",
            label: "Phụ lục",
            collapsed: false,
            items: [
                "phu-luc/dewey-decimal",
                "phu-luc/api-reference",
                "phu-luc/troubleshooting",
            ],
        },
    ],
};
export default sidebars;
