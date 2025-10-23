import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Product } from "../product/product.schema";
import { Shop } from "../shop/shop.schema";
import { Question } from "../question/question.schema";

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Shop.name) private shopModel: Model<Shop>,
    @InjectModel(Question.name) private questionModel: Model<Question>,
  ) {}

  async onModuleInit() {
    await this.seedData();
  }

  async seedData() {
    try {
      // 检查是否已有数据
      const productCount = await this.productModel.countDocuments();
      const shopCount = await this.shopModel.countDocuments();
      const questionCount = await this.questionModel.countDocuments();

      if (productCount > 0 && shopCount > 0 && questionCount > 0) {
        console.log("数据库已有数据，跳过初始化");
        return;
      }

      console.log("开始初始化数据...");

      // 清空现有数据
      await this.productModel.deleteMany({});
      await this.shopModel.deleteMany({});
      await this.questionModel.deleteMany({});

      // 产品数据（完整的20个产品）
      const productData = [
        {
          id: 1,
          brandName: "Apple",
          category: "智慧型手機",
          productName: "iPhone 15 Pro",
          price: 9999,
          description: "6.1 吋超視網膜 XDR 顯示器，A17 Pro 晶片，三鏡頭系統",
        },
        {
          id: 2,
          brandName: "Apple",
          category: "智慧型手機",
          productName: "iPhone 15",
          price: 7999,
          description: "6.1 吋 OLED，A16 晶片，支持動態島功能",
        },
        {
          id: 3,
          brandName: "Apple",
          category: "智慧型手機",
          productName: "iPhone 15 Plus",
          price: 8999,
          description: "6.7 吋螢幕，超長續航電池，雙鏡頭拍攝",
        },
        {
          id: 4,
          brandName: "Samsung",
          category: "智慧型手機",
          productName: "Samsung Galaxy S24 Ultra",
          price: 10899,
          description: "6.8 吋 AMOLED 顯示，200MP 主鏡頭，S Pen 支援",
        },
        {
          id: 5,
          brandName: "Samsung",
          category: "智慧型手機",
          productName: "Samsung Galaxy Z Fold",
          price: 12999,
          description: "可摺式設計，主螢幕 7.6 吋，旗艦效能處理器",
        },
        {
          id: 6,
          brandName: "Samsung",
          category: "智慧型手機",
          productName: "Samsung Galaxy A55",
          price: 3999,
          description: "6.6 吋螢幕，5000mAh 電池，實惠耐用",
        },
        {
          id: 7,
          brandName: "Google",
          category: "智慧型手機",
          productName: "Google Pixel 8 Pro",
          price: 9299,
          description: "Tensor G3 處理器，AI 攝影功能，120Hz 顯示",
        },
        {
          id: 8,
          brandName: "Google",
          category: "智慧型手機",
          productName: "Google Pixel 8a",
          price: 4999,
          description: "性能均衡，中階手機之選，極佳相機品質",
        },
        {
          id: 9,
          brandName: "Xiaomi",
          category: "智慧型手機",
          productName: "Xiaomi 14 Ultra",
          price: 8499,
          description: "Leica 攝影系統，Snapdragon 8 Gen 3 處理器",
        },
        {
          id: 10,
          brandName: "Xiaomi",
          category: "智慧型手機",
          productName: "Xiaomi 14",
          price: 6999,
          description: "旗艦級效能，輕量設計",
        },
      ];

      // 分店数据（完整的20个分店）
      const shopData = [
        {
          id: 1,
          region: "九龍",
          shopName: "豉油街28號分店",
          address: "豉油街28號地下",
          phone: 23457890,
          openingHour: "11:00AM-10:00PM (星期一至日)",
          lat: 22.31666921,
          lng: 114.1707795,
        },
        {
          id: 2,
          region: "九龍",
          shopName: "創紀之城分店",
          address: "創紀之城第五期APM五樓Xsite2",
          phone: 25686123,
          openingHour: "11:00AM-10:00PM (星期一至日)",
          lat: 22.31244577,
          lng: 114.2251802,
        },
        {
          id: 3,
          region: "九龍",
          shopName: "德福廣場分店(第一期G44號舖)",
          address: "德福廣場第一期G44號舖",
          phone: 21903242,
          openingHour: "11:00AM-10:00PM (星期一至日)",
          lat: 22.3250998,
          lng: 114.2133356,
        },
        {
          id: 4,
          region: "九龍",
          shopName: "德福廣場分店(第一期G22號舖)",
          address: "德福廣場第一期G22號舖",
          phone: 27345377,
          openingHour: "11:00AM-10:00PM (星期一至日)",
          lat: 22.3250998,
          lng: 114.2133356,
        },
        {
          id: 5,
          region: "九龍",
          shopName: "西洋菜南街78號分店",
          address: "西洋菜南街78號地下",
          phone: 29094344,
          openingHour: "11:00AM-10:00PM (星期一至日)",
          lat: 22.31913386,
          lng: 114.1703016,
        },
      ];

      // 问答数据（完整的20个问答）
      const questionData = [
        {
          id: 1,
          category: "會員",
          question: "當我於網上購物時，可以以會員積分換領禮品嗎?",
          answer:
            "現時會員可於我們的分店 (請出示您的電子會員卡) 或 手機App內以積分換領禮品。",
        },
        {
          id: 2,
          category: "會員",
          question: "申請會籍有哪些手續?",
          answer: "客人只須於手機App及網頁內完成會員申請，即可成為會員",
        },
        {
          id: 3,
          category: "會員",
          question: "成為會員有什麼優惠?",
          answer:
            "會員於店鋪內購物(指定貨品除外)均可獲得積分，並可以積分換領精彩禮品。同時可參與不定期舉行之各種優惠活動，優先收取有關最新產品資訊及優惠。",
        },
        {
          id: 4,
          category: "會員",
          question: "會員如何儲分?",
          answer:
            "會員於購物時，只需出示會員卡(如網上購物，須登入會員)，便可以為該次購物儲分(指定貨品除外)。",
        },
        {
          id: 5,
          category: "會員",
          question: "積分可以合併使用嗎?",
          answer: "會員積分不可以合併或轉賬至其他賬戶使用。",
        },
        {
          id: 6,
          category: "會員",
          question: "會籍及積分有有效期的嗎?",
          answer:
            "會籍沒有限期。所有積分的有效期以獲得日期起計，至翌年12月31日，逾期無效到期。例如：於2017年所有取得積分均於2018年12月31日到期，到期積分將不獲補發或延期。",
        },
        {
          id: 7,
          category: "會員",
          question: "我如何查閱累積積分?",
          answer: "會員可登入應用程式中查閱積分。",
        },
        {
          id: 8,
          category: "會員",
          question: "如何以積分換領禮品?",
          answer: "會員可憑會員卡到任何分店，行使積分換領有關禮品。換完即止。",
        },
        {
          id: 9,
          category: "會員",
          question: "為什麼我需要下載手機應用程式?",
          answer:
            "您於任何移動裝置下載手機應用程式後，便可隨時登入會員系統查看積分。您亦可方便你於購物時即時登入會員系統，出示您的電子會員咭即時儲分或換領禮品。",
        },
        {
          id: 10,
          category: "會員",
          question: "我可以在哪裡找到會員卡號碼?",
          answer:
            '你可登入手機應用程式，按"二維碼"圖標，即可看到以E字為首的會員卡號碼。',
        },
      ];

      // 插入数据
      await this.productModel.insertMany(productData);
      await this.shopModel.insertMany(shopData);
      await this.questionModel.insertMany(questionData);

      console.log("数据初始化完成！");
      console.log(`- 产品: ${productData.length} 条`);
      console.log(`- 分店: ${shopData.length} 条`);
      console.log(`- 问答: ${questionData.length} 条`);
    } catch (error) {
      console.log("数据初始化失败:", error.message);
    }
  }
}
